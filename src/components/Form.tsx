import React from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { TextInput, View, Text } from 'react-native';

export type FormProps<T extends Record<string, any>> = {
  defaultValues: T;
  onSubmit: (values: T) => void | Promise<void>;
  children: React.ReactNode;
};

export function useAppForm<T extends Record<string, any>>(defaultValues: T) {
  return useForm<T>({ defaultValues, mode: 'onBlur' });
}

export const Form: React.FC<FormProps<any>> = ({ defaultValues, onSubmit, children }) => {
  const methods = useForm({ defaultValues });
  return (
    <FormProvider {...methods}>
      <View>{children}</View>
    </FormProvider>
  );
};

export const FormTextField = <T extends Record<string, any>>({
  name,
  label,
  placeholder,
  control,
  rules,
  secureTextEntry,
}: {
  name: keyof T & string;
  label: string;
  placeholder?: string;
  control: any;
  rules?: any;
  secureTextEntry?: boolean;
}) => (
  <Controller
    control={control}
    name={name}
    rules={rules}
    render={({ field: { onChange, onBlur, value }, fieldState }) => (
      <View style={{ marginBottom: 12 }}>
        <Text style={{ fontWeight: '600', marginBottom: 4 }}>{label}</Text>
        <TextInput
          placeholder={placeholder}
          value={value ?? ''}
          onChangeText={onChange}
          onBlur={onBlur}
          secureTextEntry={secureTextEntry}
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4 }}
        />
        {fieldState.error ? (
          <Text style={{ color: 'red', marginTop: 4 }}>{fieldState.error.message}</Text>
        ) : null}
      </View>
    )}
  />
);
