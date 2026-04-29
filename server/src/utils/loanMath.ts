export interface LoanCalculation {
    principal: number;
    tenure: number;       // in days
    interestRate: number; // fixed 12% p.a.
    simpleInterest: number;
    totalRepayment: number;
  }
  
  export const calculateLoan = (principal: number, tenure: number): LoanCalculation => {
    const interestRate = 12; // fixed
    // SI = (P × R × T) / (365 × 100)
    const simpleInterest = (principal * interestRate * tenure) / (365 * 100);
    const totalRepayment = principal + simpleInterest;
  
    return {
      principal,
      tenure,
      interestRate,
      simpleInterest: Math.round(simpleInterest * 100) / 100,
      totalRepayment: Math.round(totalRepayment * 100) / 100,
    };
  };