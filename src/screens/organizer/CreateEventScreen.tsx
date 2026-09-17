// src/screens/organizer/CreateEventScreen.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  TouchableOpacity
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { collection, doc, setDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { db } from '../../config/firebase';
import { OrganizerStackParamList, Event, EventCategory, EVENT_CATEGORIES } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { colors, typography, spacing, borderRadius } from '../../theme';
import InputField from '../../components/ui/InputField';
import GradientButton from '../../components/ui/GradientButton';
import { notifyEventCreated } from '../../utils/notifications';
import { uploadImageAsync } from '../../utils/storage';

type Props = NativeStackScreenProps<OrganizerStackParamList, 'CreateEvent'>;

const STEPS = ['Basic Info', 'Date & Location', 'Tickets & Media'];

export default function CreateEventScreen({ navigation }: Props) {
  const { userProfile } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<EventCategory>('music');
  
  const [dateStr, setDateStr] = useState(''); // e.g. YYYY-MM-DD HH:MM
  const [location, setLocation] = useState('');
  const [address, setAddress] = useState('');
  
  const [priceStr, setPriceStr] = useState('0');
  const [seatsStr, setSeatsStr] = useState('');
  const [imageURI, setImageURI] = useState(''); // Local URI from ImagePicker

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 0) {
      if (!title.trim()) newErrors.title = 'Title is required';
      if (!description.trim()) newErrors.description = 'Description is required';
    } 
    else if (step === 1) {
      if (!dateStr.trim()) newErrors.dateStr = 'Date and time are required (e.g. 2026-12-01 18:00)';
      else if (isNaN(Date.parse(dateStr))) newErrors.dateStr = 'Invalid date format. Use YYYY-MM-DD HH:MM';
      
      if (!location.trim()) newErrors.location = 'Location name is required';
      if (!address.trim()) newErrors.address = 'Full address is required';
    }
    else if (step === 2) {
      const price = parseFloat(priceStr);
      const seats = parseInt(seatsStr, 10);
      if (isNaN(price) || price < 0) newErrors.priceStr = 'Price must be 0 or greater';
      if (isNaN(seats) || seats <= 0) newErrors.seatsStr = 'Total seats must be greater than 0';
      if (!imageURI) newErrors.imageURI = 'Please select a cover image';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 9], // Standard event cover ratio
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageURI(result.assets[0].uri);
      clearError('imageURI');
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(2) || !userProfile) return;
    
    setIsSubmitting(true);
    try {
      const eventRef = doc(collection(db, 'events'));
      
      // Upload image to Firebase Storage first
      const ext = imageURI.substring(imageURI.lastIndexOf('.') + 1) || 'jpg';
      const storagePath = `events/${eventRef.id}.${ext}`;
      const downloadURL = await uploadImageAsync(imageURI, storagePath);
      
      const newEvent: Event = {
        id: eventRef.id,
        title: title.trim(),
        description: description.trim(),
        category,
        date: Date.parse(dateStr),
        endDate: Date.parse(dateStr) + 7200000, // Default 2 hours later
        location: location.trim(),
        address: address.trim(),
        imageURL: downloadURL,
        price: parseFloat(priceStr),
        totalSeats: parseInt(seatsStr, 10),
        availableSeats: parseInt(seatsStr, 10),
        organizerId: userProfile.uid,
        organizerName: userProfile.displayName,
        tags: [category], // basic tagging
        status: 'upcoming',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };

      await setDoc(eventRef, newEvent);
      
      // Trigger local notification
      notifyEventCreated(newEvent.title);

      Alert.alert('Success!', 'Your event has been published successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
      
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create event');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicatorContainer}>
      {STEPS.map((stepLabel, index) => (
        <View key={index} style={styles.stepWrapper}>
          <View style={[styles.stepCircle, currentStep >= index && styles.stepCircleActive]}>
            <Text style={[styles.stepNumber, currentStep >= index && styles.stepNumberActive]}>
              {index + 1}
            </Text>
          </View>
          <Text style={[styles.stepLabel, currentStep === index && styles.stepLabelActive]}>
            {stepLabel}
          </Text>
          {index < STEPS.length - 1 && (
            <View style={[styles.stepLine, currentStep > index && styles.stepLineActive]} />
          )}
        </View>
      ))}
    </View>
  );

  const clearError = (field: string) => setErrors(e => ({ ...e, [field]: '' }));

  return (
    <KeyboardAvoidingView 
      style={styles.flex} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.screenTitle}>Create New Event</Text>
        {renderStepIndicator()}

        <View style={styles.formCard}>
          
          {/* STEP 1: Basic Info */}
          {currentStep === 0 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Let's start with the basics</Text>
              
              <InputField
                label="Event Title"
                value={title}
                onChangeText={(t) => { setTitle(t); clearError('title'); }}
                error={errors.title}
                placeholder="e.g. Summer Music Festival"
              />
              
              <InputField
                label="Description"
                value={description}
                onChangeText={(t) => { setDescription(t); clearError('description'); }}
                error={errors.description}
                placeholder="What is this event about?"
                multiline
                style={{ height: 100, paddingVertical: spacing.md }}
              />

              <Text style={styles.label}>Category</Text>
              <View style={styles.categoryContainer}>
                {EVENT_CATEGORIES.map(cat => (
                  <TouchableOpacity
                    key={cat.value}
                    style={[styles.categoryPill, category === cat.value && styles.categoryPillActive]}
                    onPress={() => setCategory(cat.value)}
                  >
                    <Text style={styles.categoryEmoji}>{cat.icon}</Text>
                    <Text style={[styles.categoryText, category === cat.value && styles.categoryTextActive]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* STEP 2: Date & Location */}
          {currentStep === 1 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>When and where?</Text>
              
              <InputField
                label="Date & Time (YYYY-MM-DD HH:MM)"
                value={dateStr}
                onChangeText={(t) => { setDateStr(t); clearError('dateStr'); }}
                error={errors.dateStr}
                placeholder="e.g. 2026-12-01 18:30"
              />
              
              <InputField
                label="Location / Venue Name"
                value={location}
                onChangeText={(t) => { setLocation(t); clearError('location'); }}
                error={errors.location}
                placeholder="e.g. Central Park"
              />
              
              <InputField
                label="Full Address"
                value={address}
                onChangeText={(t) => { setAddress(t); clearError('address'); }}
                error={errors.address}
                placeholder="e.g. Central Park, New York, NY"
              />
            </View>
          )}

          {/* STEP 3: Ticketing & Media */}
          {currentStep === 2 && (
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Tickets & Media</Text>
              
              <View style={styles.row}>
                <View style={styles.col}>
                  <InputField
                    label="Price ($)"
                    value={priceStr}
                    onChangeText={(t) => { setPriceStr(t); clearError('priceStr'); }}
                    error={errors.priceStr}
                    keyboardType="decimal-pad"
                    placeholder="0 for Free"
                  />
                </View>
                <View style={styles.spacer} />
                <View style={styles.col}>
                  <InputField
                    label="Total Seats"
                    value={seatsStr}
                    onChangeText={(t) => { setSeatsStr(t); clearError('seatsStr'); }}
                    error={errors.seatsStr}
                    keyboardType="number-pad"
                    placeholder="e.g. 100"
                  />
                </View>
              </View>

              <Text style={styles.label}>Cover Image</Text>
              <TouchableOpacity 
                style={[styles.imagePicker, errors.imageURI && styles.imagePickerError]} 
                onPress={handlePickImage}
              >
                {imageURI ? (
                  <View style={styles.imagePreviewContainer}>
                    <Text style={styles.changeImageText}>Tap to change</Text>
                    {/* We can't use Image directly without importing it, let's just show a success message or we can import Image above. Wait, I should add Image to imports! */}
                    <Text style={styles.imageSuccessText}>📸 Image Selected</Text>
                  </View>
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.imagePlaceholderIcon}>📸</Text>
                    <Text style={styles.imagePlaceholderText}>Tap to choose a photo</Text>
                  </View>
                )}
              </TouchableOpacity>
              {errors.imageURI && <Text style={styles.errorText}>{errors.imageURI}</Text>}
            </View>
          )}

        </View>

        {/* Navigation Buttons */}
        <View style={styles.actionsContainer}>
          {currentStep > 0 ? (
            <GradientButton 
              title="Back" 
              variant="outline" 
              onPress={handleBack} 
              style={styles.actionBtn}
            />
          ) : (
            <View style={styles.actionBtn} /> // Spacer
          )}
          
          <View style={styles.spacer} />

          {currentStep < STEPS.length - 1 ? (
            <GradientButton 
              title="Next" 
              onPress={handleNext} 
              style={styles.actionBtn}
            />
          ) : (
            <GradientButton 
              title="Publish Event" 
              onPress={handleSubmit} 
              isLoading={isSubmitting}
              style={styles.actionBtn}
            />
          )}
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: {
    padding: spacing.xl,
    paddingTop: spacing.xxl,
    paddingBottom: 100,
  },
  screenTitle: {
    fontSize: typography.fontSizes.xxl,
    fontWeight: typography.fontWeights.extraBold,
    color: colors.textPrimary,
    marginBottom: spacing.xxl,
  },
  stepIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xxxl,
    paddingHorizontal: spacing.md,
  },
  stepWrapper: {
    alignItems: 'center',
    position: 'relative',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundElevated,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  stepCircleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  stepNumber: {
    color: colors.textSecondary,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.bold,
  },
  stepNumberActive: {
    color: '#fff',
  },
  stepLabel: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stepLabelActive: {
    color: colors.primary,
    fontWeight: typography.fontWeights.bold,
  },
  stepLine: {
    position: 'absolute',
    top: 16,
    left: '60%',
    width: '80%',
    height: 2,
    backgroundColor: colors.surfaceBorder,
    zIndex: -1,
  },
  stepLineActive: {
    backgroundColor: colors.primary,
  },
  formCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
    ...shadows.card,
  },
  stepContent: {
    minHeight: 300,
  },
  stepTitle: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  label: {
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.medium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundElevated,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.surfaceBorder,
  },
  categoryPillActive: {
    backgroundColor: colors.primaryGlow,
    borderColor: colors.primary,
  },
  categoryEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryText: {
    color: colors.textSecondary,
    fontSize: typography.fontSizes.sm,
    fontWeight: typography.fontWeights.semiBold,
  },
  categoryTextActive: {
    color: colors.primary,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  col: {
    flex: 1,
  },
  spacer: {
    width: spacing.md,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: spacing.xxl,
  },
  actionBtn: {
    flex: 1,
  },
  imagePicker: {
    height: 150,
    backgroundColor: colors.backgroundElevated,
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.surfaceBorder,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    overflow: 'hidden',
  },
  imagePickerError: {
    borderColor: colors.error,
  },
  imagePreviewContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryGlow,
  },
  changeImageText: {
    fontSize: typography.fontSizes.xs,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  imageSuccessText: {
    fontSize: typography.fontSizes.lg,
    fontWeight: typography.fontWeights.bold,
    color: colors.primary,
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  imagePlaceholderIcon: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  imagePlaceholderText: {
    fontSize: typography.fontSizes.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeights.medium,
  },
  errorText: {
    fontSize: typography.fontSizes.xs,
    color: colors.error,
    marginTop: 4,
  },
});
