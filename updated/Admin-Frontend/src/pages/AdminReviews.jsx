import React from "react";
import axios from "axios";

export default function AdminReviews() {
  const [reviews, setReviews] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [deletingId, setDeletingId] = React.useState(null);

  // Fetch reviews from backend
  const fetchReviews = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("https://island-rasa-food-delivery-user-mana.vercel.app/api/all");
      setReviews(res.data.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch reviews"
      );
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchReviews();
  }, []);

  // Delete a review by ID
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`https://island-rasa-food-delivery-user-mana.vercel.app/api/all/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(
        err.response?.data?.message ||
        err.message ||
        "Failed to delete review"
      );
    }
    setDeletingId(null);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-10">
      <h2 className="text-3xl font-bold mb-6 text-orange-600 text-center">All Reviews</h2>
      {loading && <p className="text-center text-gray-600">Loading reviews...</p>}
      {error && <p className="text-center text-red-600">{error}</p>}
      {!loading && !error && (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm text-gray-800">
            <thead className="bg-orange-50 sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 border-b font-semibold text-left">User</th>
                <th className="py-3 px-4 border-b font-semibold text-left">Menu ID</th>
                <th className="py-3 px-4 border-b font-semibold text-center">Rating</th>
                <th className="py-3 px-4 border-b font-semibold text-left">Comment</th>
                <th className="py-3 px-4 border-b font-semibold text-center">Date</th>
                <th className="py-3 px-4 border-b font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr
                  key={r._id}
                  className="hover:bg-orange-50 transition-colors"
                >
                  <td className="py-2 px-4 border-b">
                    <div className="font-medium">{r.user?.name || "Unknown"}</div>
                    <div className="text-xs text-gray-500">{r.user?.email}</div>
                  </td>
                  <td className="py-2 px-4 border-b">{r.menu}</td>
                  <td className="py-2 px-4 border-b text-center">{r.rating}</td>
                  <td className="py-2 px-4 border-b">{r.comment}</td>
                  <td className="py-2 px-4 border-b text-center">
                    {new Date(r.createdAt).toLocaleString()}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      className={`bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition ${
                        deletingId === r._id ? "opacity-60 cursor-not-allowed" : ""
                      }`}
                      onClick={() => handleDelete(r._id)}
                      disabled={deletingId === r._id}
                    >
                      {deletingId === r._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
              {reviews.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500 text-lg">
                    No reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
