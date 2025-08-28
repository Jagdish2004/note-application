// Simple OTP service for development
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function showOTPOnScreen(email: string, otp: string): void {
  // Show OTP in a prominent way on screen
  const otpDisplay = document.createElement('div');
  otpDisplay.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #007bff;
    color: white;
    padding: 20px;
    border-radius: 8px;
    font-size: 18px;
    font-weight: bold;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    max-width: 300px;
  `;
  
  otpDisplay.innerHTML = `
    <div style="margin-bottom: 10px;">📧 OTP Sent to:</div>
    <div style="margin-bottom: 15px; font-size: 14px;">${email}</div>
    <div style="font-size: 24px; text-align: center; letter-spacing: 2px;">${otp}</div>
    <div style="margin-top: 10px; font-size: 12px; opacity: 0.8;">This code expires in 5 minutes</div>
    <button onclick="this.parentElement.remove()" style="
      position: absolute;
      top: 5px;
      right: 5px;
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
    ">×</button>
  `;
  
  document.body.appendChild(otpDisplay);
  
  // Auto-remove after 5 minutes
  setTimeout(() => {
    if (otpDisplay.parentElement) {
      otpDisplay.remove();
    }
  }, 5 * 60 * 1000);
}

export async function sendOTP(email: string): Promise<{ success: boolean; otp?: string; error?: string }> {
  try {
    const otp = generateOTP();
    
    // Show OTP on screen
    showOTPOnScreen(email, otp);
    
    return { success: true, otp };
  } catch (error) {
    return { success: false, error: 'Failed to send OTP' };
  }
}
