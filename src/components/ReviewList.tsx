import React from 'react';

interface Props {
  reviews: any[];
  rating: number;
}

const ReviewList: React.FC<Props> = ({ reviews, rating }) => {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">
        ★ {rating} · {reviews.length} reseñas
      </h3>
      {reviews.length === 0 ? (
        <p className="text-gray-500">No hay reseñas</p>
      ) : (
        <div className="space-y-4">
          {reviews.slice(0, 3).map((review, i) => (
            <div key={i} className="border-b pb-4">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                  {review.user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <p className="font-medium">{review.user?.name || 'Usuario'}</p>
                  <p className="text-gray-500 text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
