import { useState, useEffect, useCallback } from 'react'

/**
 * Generic hook for managing localStorage with type safety and SSR support
 * @template T - The type of data to store
 * @param key - The localStorage key
 * @param defaultValue - The default value if key doesn't exist
 * @param validator - Optional function to validate stored value
 * @returns [value, setValue] - Current value and function to update it
 */
export function useLocalStorage<T>(
  key: string,
  defaultValue: T,
  validator?: (value: unknown) => value is T
) {
  const [storedValue, setStoredValue] = useState<T>(defaultValue)
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      
      if (item === null) {
        setStoredValue(defaultValue)
      } else {
        const parsed = JSON.parse(item)
        
        // If validator provided, use it; otherwise accept the value
        if (validator ? validator(parsed) : true) {
          setStoredValue(parsed)
        } else {
          console.warn(`Invalid value for key "${key}", using default`)
          setStoredValue(defaultValue)
        }
      }
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      setStoredValue(defaultValue)
    } finally {
      setIsLoaded(true)
    }
  }, [key, defaultValue, validator])

  // Function to update both state and localStorage
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  return { value: storedValue, setValue, isLoaded }
}

/**
 * Type guards for common types
 */
export const typeGuards = {
  isString: (value: unknown): value is string => typeof value === 'string',
  isNumber: (value: unknown): value is number => typeof value === 'number',
  isBoolean: (value: unknown): value is boolean => typeof value === 'boolean',
  isArray: <T,>(validator: (v: unknown) => v is T) => 
    (value: unknown): value is T[] => Array.isArray(value) && value.every(validator),
  isObject: <T extends Record<string, unknown>>(shape: Record<keyof T, (v: unknown) => boolean>) =>
    (value: unknown): value is T => {
      if (typeof value !== 'object' || value === null) return false
      return Object.entries(shape).every(([key, validate]) => validate((value as any)[key]))
    },
}
