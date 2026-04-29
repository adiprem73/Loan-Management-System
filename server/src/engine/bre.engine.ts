export interface BREInput {
    dateOfBirth: string;
    monthlySalary: number;
    employmentMode: 'Salaried' | 'Self-Employed' | 'Unemployed';
    pan: string;
  }
  
  export interface BREResult {
    passed: boolean;
    errors: string[];
  }
  
  const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  
  const getAge = (dob: string): number => {
    const today = new Date();
    const birth = new Date(dob);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };
  
  export const runBRE = (input: BREInput): BREResult => {
    const errors: string[] = [];
  
    // Rule 1 — Age must be between 23 and 50
    const age = getAge(input.dateOfBirth);
    if (age < 23 || age > 50)
      errors.push(`Age must be between 23 and 50. Your age: ${age}`);
  
    // Rule 2 — Salary must be at least 25000
    if (input.monthlySalary < 25000)
      errors.push(`Monthly salary must be at least ₹25,000. Provided: ₹${input.monthlySalary}`);
  
    // Rule 3 — PAN must match valid format (ABCDE1234F)
    if (!PAN_REGEX.test(input.pan.toUpperCase()))
      errors.push(`Invalid PAN format. Must be like ABCDE1234F`);
  
    // Rule 4 — Must not be unemployed
    if (input.employmentMode === 'Unemployed')
      errors.push(`Unemployed applicants are not eligible for a loan`);
  
    return {
      passed: errors.length === 0,
      errors,
    };
  };