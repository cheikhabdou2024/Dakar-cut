
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface ReviewDialogProps {
  salonId: string;
  salonName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReviewSubmit: (salonId: string, rating: number, comment: string) => void;
}

export function ReviewDialog({ salonId, salonName, open, onOpenChange, onReviewSubmit }: ReviewDialogProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  const handleSubmit = () => {
    if (rating === 0) {
      toast({
        variant: "destructive",
        title: "Veuillez sélectionner une note.",
        description: "Vous devez donner une note pour soumettre un avis.",
      });
      return;
    }
    onReviewSubmit(salonId, rating, comment);
    resetState();
  };

  const resetState = () => {
    setRating(0);
    setHoverRating(0);
    setComment("");
  }

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      resetState();
    }
    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Laisser un avis pour {salonName}</DialogTitle>
          <DialogDescription>Vos commentaires aident les autres utilisateurs et le salon.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
            <div>
                <label className="font-medium text-sm mb-2 block">Note</label>
                <div className="flex items-center space-x-1" onMouseLeave={() => setHoverRating(0)}>
                    {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={cn(
                        "h-8 w-8 cursor-pointer transition-colors",
                        (hoverRating >= star || rating >= star)
                            ? "text-accent fill-accent"
                            : "text-muted-foreground"
                        )}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                    />
                    ))}
                </div>
            </div>
             <div>
                <label htmlFor="comment" className="font-medium text-sm mb-2 block">Commentaire (Facultatif)</label>
                <Textarea
                    id="comment"
                    placeholder="Partagez votre expérience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="min-h-[120px]"
                />
            </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>Annuler</Button>
          <Button onClick={handleSubmit}>Soumettre l'avis</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
