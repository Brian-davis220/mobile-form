import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

const GENDERS = ['Male', 'Female', 'Other'];

const initialValues = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  gender: '',
  acceptTerms: false,
};

function validate(values) {
  const errors = {};

  if (!values.fullName.trim()) {
    errors.fullName = 'Full name is required';
  } else if (values.fullName.trim().length < 3) {
    errors.fullName = 'Full name must be at least 3 characters';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address';
  }

  if (!values.phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^\+?\d{10,13}$/.test(values.phone.trim())) {
    errors.phone = 'Enter a valid phone number (10-13 digits)';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match';
  }

  if (!values.gender) {
    errors.gender = 'Please select a gender';
  }

  if (!values.acceptTerms) {
    errors.acceptTerms = 'You must accept the terms and conditions';
  }

  return errors;
}

function FormField({ label, error, ...inputProps }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor="#9ca3af"
        {...inputProps}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

export default function App() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear a field's error as soon as the user edits it
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = () => {
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setSubmitted({ ...values });
      setValues(initialValues);
    }
  };

  const handleReset = () => {
    setValues(initialValues);
    setErrors({});
    setSubmitted(null);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Registration Form</Text>
        <Text style={styles.subtitle}>Fill in your details to create an account</Text>

        <FormField
          label="Full Name"
          placeholder="John Doe"
          value={values.fullName}
          onChangeText={(text) => handleChange('fullName', text)}
          error={errors.fullName}
        />

        <FormField
          label="Email"
          placeholder="john@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={values.email}
          onChangeText={(text) => handleChange('email', text)}
          error={errors.email}
        />

        <FormField
          label="Phone Number"
          placeholder="0781234567"
          keyboardType="phone-pad"
          value={values.phone}
          onChangeText={(text) => handleChange('phone', text)}
          error={errors.phone}
        />

        <FormField
          label="Password"
          placeholder="At least 6 characters"
          secureTextEntry
          value={values.password}
          onChangeText={(text) => handleChange('password', text)}
          error={errors.password}
        />

        <FormField
          label="Confirm Password"
          placeholder="Re-enter your password"
          secureTextEntry
          value={values.confirmPassword}
          onChangeText={(text) => handleChange('confirmPassword', text)}
          error={errors.confirmPassword}
        />

        <View style={styles.field}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.radioGroup}>
            {GENDERS.map((option) => {
              const selected = values.gender === option;
              return (
                <Pressable
                  key={option}
                  style={[styles.radioOption, selected && styles.radioOptionSelected]}
                  onPress={() => handleChange('gender', option)}
                >
                  <View style={[styles.radioCircle, selected && styles.radioCircleSelected]} />
                  <Text style={[styles.radioLabel, selected && styles.radioLabelSelected]}>
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {errors.gender ? <Text style={styles.errorText}>{errors.gender}</Text> : null}
        </View>

        <View style={styles.field}>
          <View style={styles.switchRow}>
            <Switch
              value={values.acceptTerms}
              onValueChange={(value) => handleChange('acceptTerms', value)}
              trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
              thumbColor={values.acceptTerms ? '#2563eb' : '#f4f4f5'}
            />
            <Text style={styles.switchLabel}>I accept the terms and conditions</Text>
          </View>
          {errors.acceptTerms ? <Text style={styles.errorText}>{errors.acceptTerms}</Text> : null}
        </View>

        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>

        <Pressable style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Reset</Text>
        </Pressable>

        {submitted ? (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>Registration successful!</Text>
            <Text style={styles.resultLine}>Name: {submitted.fullName}</Text>
            <Text style={styles.resultLine}>Email: {submitted.email}</Text>
            <Text style={styles.resultLine}>Phone: {submitted.phone}</Text>
            <Text style={styles.resultLine}>Gender: {submitted.gender}</Text>
          </View>
        ) : null}
      </ScrollView>
      <StatusBar style="auto" />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    marginTop: 4,
    marginBottom: 24,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 13,
    marginTop: 4,
  },
  radioGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  radioOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  radioOptionSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#9ca3af',
    marginRight: 8,
  },
  radioCircleSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#2563eb',
  },
  radioLabel: {
    fontSize: 15,
    color: '#374151',
  },
  radioLabelSelected: {
    color: '#1d4ed8',
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 15,
    color: '#374151',
    marginLeft: 8,
    flexShrink: 1,
  },
  button: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonPressed: {
    backgroundColor: '#1d4ed8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resetButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  resetButtonText: {
    color: '#6b7280',
    fontSize: 15,
  },
  resultCard: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#10b981',
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  resultTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#047857',
    marginBottom: 8,
  },
  resultLine: {
    fontSize: 15,
    color: '#065f46',
    marginBottom: 2,
  },
});
