import Rider from '../models/Rider.js'; // adjust the path if needed
import nodemailer from 'nodemailer';




export const getAllRiders = async (req, res) => {
  try {
   // Fetch all riders from the database
   const riders = await Rider.find();
    // Map each rider to a clear, flat object for table display
    const riderList = riders.map(rider => ({
      id: rider._id,
      email: rider.email,
      status: rider.status,
      location: rider.location,
      vehicleType: rider.vehicleType,
      vehicleInfo: rider.vehicleInfo,
      profilePictureUrl: rider.profilePictureUrl,
      workType: rider.workType,
      availableTimeSlots: rider.availableTimeSlots,
      personalInfo: rider.personalInfo
    }));

    // Respond with total count at the top, then the list
    res.status(200).json({
      totalRiders: riderList.length,
      riders: riderList
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch riders.", error: err.message });
  }
};




export const updateRiderStatus = async (req, res) => {
  try {
    const { riderId, status } = req.body;

    // Validate inputs
    if (!riderId || !status) {
      return res.status(400).json({ success: false, message: "riderId and status are required." });
    }

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return res.status(400).json({ success: false, message: "Status must be either APPROVED or REJECTED." });
    }

    // Find rider
    const rider = await Rider.findById(riderId);
    if (!rider) {
      return res.status(404).json({ success: false, message: "Rider not found." });
    }

    // Update status
    rider.status = status;
    await rider.save();

    // Set up Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Prepare email content
    const name = rider.personalInfo?.name || 'Rider';
    let subject, html;

    if (status === 'APPROVED') {
      subject = "🎉 Your Rider Account Has Been Approved!";
      html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Welcome to Island Rasa Delivery, ${name}!</h2>
          <p>Your rider account has been <strong>approved</strong>.</p>
          <p>You can now start accepting delivery requests through the app.</p>
          <p>Best regards,<br/>Island Rasa Team</p>
        </div>
      `;
    } else {
      subject = "❗ Rider Account Update";
      html = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Account Status Update</h2>
          <p>Dear ${name},</p>
          <p>Your rider application has been <strong>rejected</strong>.</p>
          <p>Please contact support@islandrasa.com for more details.</p>
          <p>Best regards,<br/>Island Rasa Team</p>
        </div>
      `;
    }

    // Send email
    try {
      await transporter.sendMail({
        from: `Island Rasa Delivery <${process.env.EMAIL_USER}>`,
        to: rider.email,
        subject,
        html,
      });
      console.log(`Email sent to ${rider.email}`);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Continue even if email fails
    }

    res.status(200).json({
      success: true,
      message: `Rider status updated to ${status} and notification sent.`,
      rider: {
        id: rider._id,
        email: rider.email,
        status: rider.status,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update rider status.", error: err.message });
  }
};
