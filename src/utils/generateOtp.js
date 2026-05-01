export const generateotp = () => {
  return Math.floor(100000 + Math.random() * 900000); 
};
// always it will give six deigit number vivsible as a OTP