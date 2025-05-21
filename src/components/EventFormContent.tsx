
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";

interface EventFormContentProps {
  eventId?: string;
}

const POSITIONS = [
  "ΕΦ.ΠΛΑΓΙΕΣ",
  "ΕΦ ΓΕΜΙΣΤΗΣ",
  "ΕΦ Μ.ΟΓΚΟΥ",
  "ΕΦ ΠΕΤΡΑΔΩΝ",
  "ΕΦ ΔΙΛΟΦΟΥ",
  "ΕΦ 5",
  "ΕΠΟΧΟΥΜΕΝΟ"
];

const EventFormContent: React.FC<EventFormContentProps> = ({ eventId }) => {
  const isEditing = Boolean(eventId);
  const { user } = useAuth();
  
  // Form state
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState<string>("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Handle image selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setImage(selectedFile);
      
      // Create image preview
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  
  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title || !position || !description || !date || !startTime || !endTime) {
      toast.error("Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία");
      return;
    }
    
    // Submit form logic would go here
    toast.success(isEditing ? "Το συμβάν ενημερώθηκε" : "Το συμβάν δημιουργήθηκε");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{isEditing ? "Επεξεργασία Συμβάντος" : "Νέο Συμβάν"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Τίτλος</Label>
            <Input 
              id="title" 
              placeholder="Τίτλος συμβάντος" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="position">Θέση</Label>
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger>
                <SelectValue placeholder="Επιλέξτε θέση" />
              </SelectTrigger>
              <SelectContent>
                {POSITIONS.map((pos) => (
                  <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Περιγραφή</Label>
            <Textarea 
              id="description" 
              placeholder="Περιγραφή συμβάντος" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Ημερομηνία</Label>
              <Input 
                id="date" 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Ώρα Έναρξης</Label>
              <Input 
                id="startTime" 
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="endTime">Ώρα Λήξης</Label>
            <Input 
              id="endTime" 
              type="time" 
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Εικόνα</Label>
            <Input 
              id="image" 
              type="file" 
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          
          {/* Image Preview Section */}
          {imagePreview && (
            <div className="mt-4">
              <Label>Προεπισκόπηση Εικόνας</Label>
              <div className="mt-2 border rounded-md overflow-hidden">
                <img 
                  src={imagePreview} 
                  alt="Event preview" 
                  className="max-h-64 w-full object-contain"
                />
              </div>
            </div>
          )}
          
          {/* Event Creator Information */}
          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-medium mb-2">Πληροφορίες Καταχώρησης</h3>
            <p className="text-sm text-muted-foreground">
              Χρήστης: {user?.name || "Άγνωστος"}
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button type="button" variant="outline">Ακύρωση</Button>
          <Button type="submit">{isEditing ? "Ενημέρωση" : "Δημιουργία"}</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default EventFormContent;
