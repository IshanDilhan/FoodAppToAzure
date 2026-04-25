import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

function MenuReviewPage() {
  const { menuId } = useParams();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch menu details and all reviews for this menu
  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setLoading(true);
      try {
        const [menuRes, reviewRes] = await Promise.all([
          axios.get(`/api/menu/${menuId}`), // Adjust this if your menu endpoint is different
          axios.get(`http://localhost:4010/api/reviews/${menuId}`)
        ]);
        if (isMounted) {
          setMenu(menuRes.data?.data || null);
          setReviews(reviewRes.data?.data || []);
        }
      } catch (err) {
        setMenu(null);
        setReviews([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchData();
    return () => { isMounted = false; };
  }, [menuId]);

  const handleAddReview = () => {
    navigate(`/menu/${menuId}/add-review`);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-4">
        <Link to="/" className="text-blue-600 hover:underline text-sm">
          &larr; Back to Menu
        </Link>
        <button
          onClick={handleAddReview}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <PlusCircleIcon className="w-5 h-5" />
          Add New Review
        </button>
      </div>

      {loading ? (
        <div className="mt-8 text-gray-500">Loading...</div>
      ) : (
        <>
          {menu && (
            <div className="flex items-center gap-4 mt-6 mb-8">
              <img
                src={menu.image}
                alt={menu.name}
                className="w-20 h-20 object-cover rounded-lg border"
              />
              <div>
                <div className="text-2xl font-bold">{menu.name}</div>
                <div className="text-gray-600">{menu.description}</div>
                <div className="font-semibold mt-1">
                  රු {parseFloat(menu.price).toFixed(2)}
                </div>
              </div>
            </div>
          )}
          
          <h2 className="text-xl font-bold mb-4">
            Reviews {reviews.length > 0 && <span className="text-gray-500 text-base">({reviews.length})</span>}
          </h2>
          {reviews.length === 0 ? (
            <div className="text-gray-500">No reviews for this menu item yet.</div>
          ) : (
            <ul className="space-y-4">
              {reviews.map((review) => (
                <li key={review._id} className="border-b pb-2 flex items-start gap-3">
                  {/* Profile picture */}
                  <img
                    src={review.user?.photo || "/default-profile.png"}
                    alt={review.user?.name || "User"}
                    className="w-10 h-10 rounded-full object-cover border"
                    style={{ minWidth: 40, minHeight: 40 }}
                  />
                  <div className="flex-1">
                    <div className="font-semibold">{review.user?.name || "User"}</div>
                    <div className="text-yellow-500">
                      {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                    </div>
                    <div>{review.comment}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default MenuReviewPage;
