import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/auth";
import { toast } from "sonner";
import { createEvent, updateEvent, getEvent, uploadEventImages } from "@/services/eventService";
import { format } from "date-fns";

interface EventFormContentProps {
  eventId?: string;
}

// Available positions for event selection
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
  const navigate = useNavigate();
  
  // Form state for all event fields
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState<string>("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  
  // Image handling state
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Load existing event data if editing
  useEffect(() => {
    const loadEventData = async () => {
      if (!isEditing || !eventId) return;
      
      setIsLoadingData(true);
      try {
        console.log('Loading event data for editing:', eventId);
        const eventData = await getEvent(eventId);
        
        if (eventData) {
          // Populate form fields with existing data
          setTitle(eventData.title);
          setPosition(eventData.position || "");
          setDescription(eventData.description);
          setNotes(eventData.notes || "");
          setDate(format(eventData.date, 'yyyy-MM-dd'));
          setStartTime(eventData.time);
          setEndTime(eventData.endTime || "");
          setExistingImages(eventData.imageUrls || []);
          
          console.log('Event data loaded successfully');
        } else {
          toast.error('Δεν βρέθηκε το συμβάν');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error loading event data:', error);
        toast.error('Σφάλμα φόρτωσης δεδομένων συμβάντος');
        navigate('/dashboard');
      } finally {
        setIsLoadingData(false);
      }
    };

    loadEventData();
  }, [isEditing, eventId, navigate]);
  
  // Handle multiple image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
      
      // Create preview URLs for selected images
      const previewUrls = filesArray.map(file => {
        const reader = new FileReader();
        return new Promise<string>((resolve) => {
          reader.onload = (event) => {
            resolve(event.target?.result as string);
          };
          reader.readAsDataURL(file);
        });
      });
      
      // Update preview state when all images are processed
      Promise.all(previewUrls).then(urls => {
        setImagePreviews(urls);
      });
      
      console.log('Selected', filesArray.length, 'images for upload');
    }
  };
  
  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!title || !position || !description || !date || !startTime) {
      toast.error("Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία");
      return;
    }

    // Validate time format (end time should be after start time)
    if (endTime && startTime && endTime <= startTime) {
      toast.error("Η ώρα λήξης πρέπει να είναι μετά την ώρα έναρξης");
      return;
    }
    
    if (!user) {
      toast.error("Πρέπει να είστε συνδεδεμένος για να δημιουργήσετε συμβάν");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare event data object
      const eventData = {
        title,
        position,
        description,
        notes,
        date: new Date(date),
        time: startTime,
        endTime: endTime || undefined,
        location: position, // Use position as location
        imageUrls: [], // Will be updated after image upload
        createdBy: user.name,
        createdById: user.id
      };
      
      let savedEvent;
      
      if (isEditing && eventId) {
        // Update existing event
        console.log('Updating existing event:', eventId);
        savedEvent = await updateEvent(eventId, eventData);
        toast.success("Το συμβάν ενημερώθηκε με επιτυχία");
      } else {
        // Create new event
        console.log('Creating new event');
        savedEvent = await createEvent(eventData);
        toast.success("Το συμβάν δημιουργήθηκε με επιτυχία");
      }
      
      // Upload new images if any were selected
      if (selectedFiles.length > 0) {
        try {
          console.log('Uploading', selectedFiles.length, 'images...');
          await uploadEventImages(selectedFiles, savedEvent.id);
          toast.success(`Ανέβηκαν ${selectedFiles.length} εικόνες`);
        } catch (imageError) {
          console.error('Image upload failed:', imageError);
          toast.error('Το συμβάν αποθηκεύτηκε αλλά η μεταφόρτωση εικόνων απέτυχε');
        }
      }
      
      // Navigate back to dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Event submission failed:', error);
      toast.error(isEditing ? "Αποτυχία ενημέρωσης συμβάντος" : "Αποτυχία δημιουργίας συμβάντος");
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel button handler
  const handleCancel = () => {
    navigate('/dashboard');
  };

  // Show loading spinner while loading existing event data
  if (isLoadingData) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Φόρτωση δεδομένων συμβάντος...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>
            {isEditing ? "Επεξεργασία Συμβάντος" : "Νέο Συμβάν"}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Event Title Field */}
          <div className="space-y-2">
            <Label htmlFor="title">Τίτλος *</Label>
            <Input 
              id="title" 
              placeholder="Τίτλος συμβάντος" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          {/* Position Selection Field */}
          <div className="space-y-2">
            <Label htmlFor="position">Θέση *</Label>
            <Select value={position} onValueChange={setPosition} disabled={isLoading}>
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
          
          {/* Description Field */}
          <div className="space-y-2">
            <Label htmlFor="description">Περιγραφή *</Label>
            <Textarea 
              id="description" 
              placeholder="Περιγραφή συμβάντος" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              disabled={isLoading}
              rows={4}
            />
          </div>
          
          {/* Additional Notes Field */}
          <div className="space-y-2">
            <Label htmlFor="notes">Πρόσθετες Σημειώσεις</Label>
            <Textarea 
              id="notes" 
              placeholder="Πρόσθετες πληροφορίες ή σημειώσεις" 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>
          
          {/* Date and Time Fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Ημερομηνία *</Label>
              <Input 
                id="date" 
                type="date" 
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startTime">Ώρα Έναρξης *</Label>
              <Input 
                id="startTime" 
                type="time" 
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Ώρα Λήξης</Label>
              <Input 
                id="endTime" 
                type="time" 
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          
          {/* Image Upload Field */}
          <div className="space-y-2">
            <Label htmlFor="images">Εικόνες</Label>
            <Input 
              id="images" 
              type="file" 
              accept="image/*"
              multiple
              onChange={handleImageChange}
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground">
              Μπορείτε να επιλέξετε πολλαπλές εικόνες
            </p>
          </div>
          
          {/* Existing Images Preview (for editing) */}
          {existingImages.length > 0 && (
            <div className="space-y-2">
              <Label>Υπάρχουσες Εικόνες</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {existingImages.map((url, index) => (
                  <div key={index} className="border rounded-md overflow-hidden">
                    <img 
                      src={url} 
                      alt={`Existing image ${index + 1}`} 
                      className="w-full h-32 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* New Images Preview */}
          {imagePreviews.length > 0 && (
            <div className="space-y-2">
              <Label>Προεπισκόπηση Νέων Εικόνων</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="border rounded-md overflow-hidden">
                    <img 
                      src={preview} 
                      alt={`Preview ${index + 1}`} 
                      className="w-full h-32 object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Creator Information */}
          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-medium mb-2">Πληροφορίες Καταχώρησης</h3>
            <p className="text-sm text-muted-foreground">
              Χρήστης: {user?.name || "Άγνωστος"}
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-2">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            disabled={isLoading}
          >
            Ακύρωση
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading 
              ? (isEditing ? "Ενημέρωση..." : "Δημιουργία...") 
              : (isEditing ? "Ενημέρωση" : "Δημιουργία")
            }
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default EventFormContent;
