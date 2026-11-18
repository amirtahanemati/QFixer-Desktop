/**
 * Generates synthetic educational document images with real shadows and scientific content.
 * Used for instant preview and testing when the user wants to test before importing a custom file.
 */

export function generateEducationalSample(type: "math" | "physics" | "handwritten"): string {
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 1600;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // 1. Slightly warm paper background
  ctx.fillStyle = "#F8F5EE";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 2. Render real text and scientific formulas
  ctx.fillStyle = "#18181B";
  ctx.direction = "rtl";

  if (type === "math") {
    // Header
    ctx.font = "bold 34px Vazirmatn, sans-serif";
    ctx.fillText("آزمون سراسری ریاضی - سؤال شماره ۱۲", 1120, 140);

    ctx.font = "24px Vazirmatn, sans-serif";
    ctx.fillText("مطلوب است محاسبه حد و مشتق تابع مثلثاتی زیر در نقطه صفر:", 1120, 220);

    // Math Equation drawing (Latin formula)
    ctx.direction = "ltr";
    ctx.font = "italic 32px 'Times New Roman', serif";
    ctx.fillText("f(x) = ", 120, 340);

    // Fraction
    ctx.fillText("lim", 230, 320);
    ctx.font = "italic 20px 'Times New Roman', serif";
    ctx.fillText("x -> 0", 230, 350);

    ctx.font = "italic 30px 'Times New Roman', serif";
    ctx.fillText("sqrt( 1 + sin(2x) )  -  ( cos(x) )^2", 340, 310);

    // Fraction line
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#18181B";
    ctx.beginPath();
    ctx.moveTo(330, 335);
    ctx.lineTo(880, 335);
    ctx.stroke();

    ctx.fillText("3x  +  tan(4x)", 480, 380);

    // Persian question options
    ctx.direction = "rtl";
    ctx.font = "22px Vazirmatn, sans-serif";
    ctx.fillText("۱) مقدار حد برابر با ۱/۴ است.", 1100, 500);
    ctx.fillText("۲) حد تابع برابر با ۲/۳ است.", 1100, 560);
    ctx.fillText("۳) تابع در نقطه صفر تعریف نشده و مشتق‌ناپذیر است.", 1100, 620);
    ctx.fillText("۴) مقدار حد برابر با ۳/۷ است.", 1100, 680);

    // Integral formula section
    ctx.direction = "ltr";
    ctx.font = "italic 28px 'Times New Roman', serif";
    ctx.fillText("Integral:", 120, 800);
    ctx.fillText("I = \\int_{0}^{\\pi/2}  x \\cdot cos(x) dx  =  [ x \\cdot sin(x) ]_{0}^{\\pi/2} - \\int sin(x) dx", 120, 860);
  } else {
    // Physics with coordinate diagram
    ctx.font = "bold 34px Vazirmatn, sans-serif";
    ctx.fillText("فیزیک دوازدهم - نمودار سرعت-زمان و شتاب", 1120, 140);

    ctx.font = "24px Vazirmatn, sans-serif";
    ctx.fillText("با توجه به نمودار v-t زیر، جابه‌جایی کل متحرک در بازه ۰ تا ۱۰ ثانیه را بیابید:", 1120, 220);

    // Draw Coordinate System
    ctx.direction = "ltr";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#0F172A";

    // Axes
    ctx.beginPath();
    ctx.moveTo(180, 750);
    ctx.lineTo(950, 750); // t-axis
    ctx.lineTo(940, 740);
    ctx.moveTo(950, 750);
    ctx.lineTo(940, 760);

    ctx.moveTo(250, 800);
    ctx.lineTo(250, 360); // v-axis
    ctx.lineTo(240, 370);
    ctx.moveTo(250, 360);
    ctx.lineTo(260, 370);
    ctx.stroke();

    ctx.font = "bold 20px sans-serif";
    ctx.fillText("t (s)", 960, 755);
    ctx.fillText("v (m/s)", 220, 340);

    // Colored Diagram Graph line
    ctx.lineWidth = 4;
    ctx.strokeStyle = "#2563EB"; // Blue line
    ctx.beginPath();
    ctx.moveTo(250, 750);
    ctx.lineTo(450, 480);
    ctx.lineTo(700, 480);
    ctx.lineTo(900, 750);
    ctx.stroke();

    // Red Arrow vector
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#DC2626";
    ctx.beginPath();
    ctx.moveTo(450, 480);
    ctx.lineTo(550, 420);
    ctx.stroke();
  }

  // 3. Add heavy realistic mobile camera shadow and scanning gradient!
  // Dark corner shadow on top-left and right gradient
  const shadowGrad = ctx.createLinearGradient(0, 0, canvas.width * 0.8, canvas.height * 0.9);
  shadowGrad.addColorStop(0.0, "rgba(20, 15, 10, 0.65)"); // Dark phone hand shadow
  shadowGrad.addColorStop(0.4, "rgba(40, 35, 25, 0.35)");
  shadowGrad.addColorStop(0.7, "rgba(80, 75, 60, 0.15)");
  shadowGrad.addColorStop(1.0, "rgba(255, 255, 255, 0.0)");

  ctx.fillStyle = shadowGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add paper texture noise
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 14;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  return canvas.toDataURL("image/png");
}
