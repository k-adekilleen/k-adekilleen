import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { insertReviewSchema, type Review } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface ProductReviewsProps {
  productId: number;
}

type ReviewFormData = {
  rating: number;
  comment: string;
  userName: string;
};

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= rating ? "fill-primary text-primary" : "text-muted-foreground"
          }`}
        />
      ))}
    </div>
  );
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const { toast } = useToast();
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: {
      rating: 5,
      comment: "",
      userName: "",
    },
  });

  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: [`/api/products/${productId}/reviews`],
  });

  const { mutate: submitReview, isPending } = useMutation({
    mutationFn: async (data: ReviewFormData) => {
      await apiRequest(
        "POST",
        `/api/products/${productId}/reviews`,
        data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/reviews`] });
      form.reset();
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    submitReview(data);
  });

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Reviews</h2>

        {isLoading ? (
          <p>Loading reviews...</p>
        ) : reviews?.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {reviews?.map((review) => (
              <div key={review.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">{review.userName}</div>
                  <StarRating rating={review.rating} />
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
                <div className="text-sm text-muted-foreground mt-2">
                  {new Date(review.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="userName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Share your experience with this product"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
            >
              Submit Review
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}