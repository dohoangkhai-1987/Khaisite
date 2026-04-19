import { useState, useCallback } from "react";

interface Step {
  label: string;
  content: string;
  isHighlight?: boolean;
  isError?: boolean;
  isResult?: boolean;
}

function App() {
  const [a, setA] = useState<string>("");
  const [b, setB] = useState<string>("");
  const [c, setC] = useState<string>("");
  const [steps, setSteps] = useState<Step[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shakeInput, setShakeInput] = useState(false);
  const [hasResult, setHasResult] = useState(false);

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const formatNumber = (n: number): string => {
    if (Number.isInteger(n)) return n.toString();
    // Check for common fractions
    const rounded = Math.round(n * 10000) / 10000;
    return rounded.toString();
  };

  const solveEquation = useCallback(async () => {
    // Validate inputs
    const numA = parseFloat(a);
    const numB = parseFloat(b);
    const numC = parseFloat(c);

    if (isNaN(numA) || isNaN(numB) || isNaN(numC)) {
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 500);
      setSteps([
        {
          label: "⚠️ CẢNH BÁO",
          content: "Hãy nhập đầy đủ các hệ số bằng chữ số, hỡi chiến binh!",
          isError: true,
        },
      ]);
      return;
    }

    if (numA === 0) {
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 500);
      setSteps([
        {
          label: "⚠️ CẢNH BÁO",
          content:
            "Hệ số a không được bằng 0! Nếu a = 0 thì đây không còn là phương trình bậc hai nữa!",
          isError: true,
        },
      ]);
      return;
    }

    setIsAnimating(true);
    setHasResult(false);
    const newSteps: Step[] = [];

    // Step 1: Write the equation
    const formatCoeff = (val: number, varName: string, isFirst: boolean) => {
      if (val === 0) return "";
      let sign = val > 0 ? (isFirst ? "" : " + ") : (isFirst ? "-" : " - ");
      let absVal = Math.abs(val);
      let coeff = absVal === 1 && varName !== "" ? "" : absVal.toString();
      return `${sign}${coeff}${varName}`;
    };

    let equationStr = "";
    if (numA !== 0) equationStr += formatCoeff(numA, "x²", true);
    if (numB !== 0) equationStr += formatCoeff(numB, "x", equationStr === "");
    if (numC !== 0)
      equationStr += formatCoeff(numC, "", equationStr === "");
    if (equationStr === "") equationStr = "0";
    equationStr += " = 0";

    newSteps.push({
      label: "📜 BƯỚC 1: BÀI TOÁN",
      content: `Phương trình: ${equationStr}`,
    });
    setSteps([...newSteps]);
    await delay(600);

    // Step 2: Identify coefficients
    newSteps.push({
      label: "🔍 BƯỚC 2: NHẬN DIỆN HỆ SỐ",
      content: `a = ${numA},  b = ${numB},  c = ${numC}`,
    });
    setSteps([...newSteps]);
    await delay(600);

    // Step 3: Calculate discriminant
    const delta = numB * numB - 4 * numA * numC;
    const deltaStr = `${numB}² - 4 × ${numA} × ${numC} = ${numB * numB} - ${
      4 * numA * numC
    } = ${delta}`;

    newSteps.push({
      label: "⚡ BƯỚC 3: TÍNH BẢNG CHỮ SỐ Δ (DELTA)",
      content: `Δ = b² - 4ac = ${deltaStr}`,
      isHighlight: true,
    });
    setSteps([...newSteps]);
    await delay(600);

    // Step 4: Analyze discriminant
    if (delta > 0) {
      newSteps.push({
        label: "🌟 BƯỚC 4: PHÁN ĐOÁN",
        content: `Δ = ${delta} > 0 → Phương trình có HAI NGHIỆM THỰC PHÂN BIỆT!`,
      });
      setSteps([...newSteps]);
      await delay(600);

      const sqrtDelta = Math.sqrt(delta);
      const x1 = (-numB + sqrtDelta) / (2 * numA);
      const x2 = (-numB - sqrtDelta) / (2 * numA);

      newSteps.push({
        label: "🗡️ BƯỚC 5: TÍNH NGHIỆM",
        content: `√Δ = √${delta} = ${formatNumber(sqrtDelta)}`,
      });
      setSteps([...newSteps]);
      await delay(500);

      newSteps.push({
        label: "⚔️ NGHIỆM THỨ NHẤT (x₁)",
        content: `x₁ = (-b + √Δ) / (2a) = (${formatNumber(-numB)} + ${formatNumber(
          sqrtDelta
        )}) / ${formatNumber(2 * numA)} = ${formatNumber(x1)}`,
      });
      setSteps([...newSteps]);
      await delay(500);

      newSteps.push({
        label: "⚔️ NGHIỆM THỨ HAI (x₂)",
        content: `x₂ = (-b - √Δ) / (2a) = (${formatNumber(-numB)} - ${formatNumber(
          sqrtDelta
        )}) / ${formatNumber(2 * numA)} = ${formatNumber(x2)}`,
      });
      setSteps([...newSteps]);
      await delay(500);

      newSteps.push({
        label: "🏆 KẾT QUẢ CUỐI CÙNG",
        content: `x₁ = ${formatNumber(x1)}   và   x₂ = ${formatNumber(x2)}`,
        isResult: true,
      });
    } else if (delta === 0) {
      newSteps.push({
        label: "🌟 BƯỚC 4: PHÁN ĐOÁN",
        content: `Δ = 0 → Phương trình có NGHIỆM KÉP (một nghiệm duy nhất)!`,
      });
      setSteps([...newSteps]);
      await delay(600);

      const x = -numB / (2 * numA);

      newSteps.push({
        label: "🗡️ BƯỚC 5: TÍNH NGHIỆM KÉP",
        content: `x = -b / (2a) = ${formatNumber(-numB)} / ${formatNumber(
          2 * numA
        )} = ${formatNumber(x)}`,
      });
      setSteps([...newSteps]);
      await delay(500);

      newSteps.push({
        label: "🏆 KẾT QUẢ CUỐI CÙNG",
        content: `Nghiệm kép: x = ${formatNumber(x)}`,
        isResult: true,
      });
    } else {
      newSteps.push({
        label: "🌟 BƯỚC 4: PHÁN ĐOÁN",
        content: `Δ = ${delta} < 0 → Phương trình có HAI NGHIỆM PHỨC (ảo)!`,
      });
      setSteps([...newSteps]);
      await delay(600);

      const absDelta = Math.abs(delta);
      const sqrtAbsDelta = Math.sqrt(absDelta);
      const realPart = -numB / (2 * numA);
      const imagPart = sqrtAbsDelta / (2 * numA);

      newSteps.push({
        label: "🗡️ BƯỚC 5: TÍNH NGHIỆM PHỨC",
        content: `Phần thực: -b/(2a) = ${formatNumber(realPart)}\nPhần ảo: √|Δ|/(2a) = ${formatNumber(imagPart)}`,
      });
      setSteps([...newSteps]);
      await delay(500);

      newSteps.push({
        label: "🏆 KẾT QUẢ CUỐI CÙNG",
        content: `x₁ = ${formatNumber(realPart)} + ${formatNumber(imagPart)}i\nx₂ = ${formatNumber(realPart)} - ${formatNumber(imagPart)}i`,
        isResult: true,
      });
    }

    setSteps([...newSteps]);
    setHasResult(true);
    setIsAnimating(false);
  }, [a, b, c]);

  const resetAll = () => {
    setA("");
    setB("");
    setC("");
    setSteps([]);
    setHasResult(false);
    setIsAnimating(false);
  };

  return (
    <div className="wood-bg min-h-screen flex flex-col items-center justify-start py-8 px-4 relative overflow-hidden">
      {/* Background decorative particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="particle"
          style={{ top: "10%", left: "15%", animationDelay: "0s" }}
        />
        <div
          className="particle"
          style={{ top: "20%", left: "80%", animationDelay: "0.5s" }}
        />
        <div
          className="particle"
          style={{ top: "60%", left: "10%", animationDelay: "1s" }}
        />
        <div
          className="particle"
          style={{ top: "70%", left: "90%", animationDelay: "1.5s" }}
        />
        <div
          className="particle"
          style={{ top: "40%", left: "50%", animationDelay: "2s" }}
        />
        <div
          className="particle"
          style={{ top: "85%", left: "30%", animationDelay: "2.5s" }}
        />
        <div
          className="particle"
          style={{ top: "5%", left: "60%", animationDelay: "0.8s" }}
        />
        <div
          className="particle"
          style={{ top: "50%", left: "75%", animationDelay: "1.8s" }}
        />
      </div>

      {/* Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-3xl sword-icon">⚔️</span>
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-black header-glow"
            style={{
              fontFamily: "'Cinzel', serif",
              color: "var(--gold)",
              letterSpacing: "0.15em",
            }}
          >
            PHÉP THUẬT GIẢI MÃ
          </h1>
          <span className="text-3xl sword-icon">⚔️</span>
        </div>
        <h2
          className="text-lg sm:text-xl md:text-2xl font-semibold"
          style={{
            fontFamily: "'MedievalSharp', cursive",
            color: "var(--parchment)",
            letterSpacing: "0.08em",
          }}
        >
          Phương Trình Bậc Hai
        </h2>
        <p
          className="text-xs sm:text-sm mt-2 italic"
          style={{
            color: "rgba(244, 228, 193, 0.6)",
            fontFamily: "'MedievalSharp', cursive",
          }}
        >
         .ax² + bx + c = 0
        </p>
      </div>

      {/* Main Card */}
      <div
        className={`medieval-card rounded-lg w-full max-w-2xl p-6 sm:p-8 md:p-10 relative ${
          shakeInput ? "shake" : ""
        }`}
      >
        {/* Corner decorations */}
        <div className="corner-decoration corner-tl" />
        <div className="corner-decoration corner-tr" />
        <div className="corner-decoration corner-bl" />
        <div className="corner-decoration corner-br" />

        {/* Equation Display */}
        <div className="text-center mb-6">
          <div className="border-pattern mb-4" />
          <p
            className="text-xl sm:text-2xl font-bold magic-glow"
            style={{
              fontFamily: "'Cinzel', serif",
              color: "var(--blood-red)",
            }}
          >
            {a || "a"}x² + {b || "b"}x + {c || "c"} = 0
          </p>
          <div className="border-pattern mt-4" />
        </div>

        {/* Input Section */}
        <div className="mb-6">
          <p
            className="text-center mb-4 text-sm sm:text-base font-semibold"
            style={{
              fontFamily: "'MedievalSharp', cursive",
              color: "var(--wood-medium)",
            }}
          >
            📜 Nhập các hệ số của phương trình:
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {/* Coefficient a */}
            <div className="flex flex-col items-center gap-1">
              <label
                className="text-xs font-bold uppercase tracking-wider"
                style={{
                  color: "var(--brass-dark)",
                  fontFamily: "'Cinzel', serif",
                }}
              >
                Hệ số a
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={a}
                  onChange={(e) => setA(e.target.value)}
                  placeholder="a"
                  className="medieval-input w-20 sm:w-24 rounded"
                />
                <span
                  className="text-lg font-bold"
                  style={{ color: "var(--wood-medium)" }}
                >
                  x²
                </span>
              </div>
            </div>

            <span
              className="text-2xl font-bold hidden sm:block"
              style={{ color: "var(--brass)" }}
            >
              +
            </span>

            {/* Coefficient b */}
            <div className="flex flex-col items-center gap-1">
              <label
                className="text-xs font-bold uppercase tracking-wider"
                style={{
                  color: "var(--brass-dark)",
                  fontFamily: "'Cinzel', serif",
                }}
              >
                Hệ số b
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={b}
                  onChange={(e) => setB(e.target.value)}
                  placeholder="b"
                  className="medieval-input w-20 sm:w-24 rounded"
                />
                <span
                  className="text-lg font-bold"
                  style={{ color: "var(--wood-medium)" }}
                >
                  x
                </span>
              </div>
            </div>

            <span
              className="text-2xl font-bold hidden sm:block"
              style={{ color: "var(--brass)" }}
            >
              +
            </span>

            {/* Coefficient c */}
            <div className="flex flex-col items-center gap-1">
              <label
                className="text-xs font-bold uppercase tracking-wider"
                style={{
                  color: "var(--brass-dark)",
                  fontFamily: "'Cinzel', serif",
                }}
              >
                Hệ số c
              </label>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={c}
                  onChange={(e) => setC(e.target.value)}
                  placeholder="c"
                  className="medieval-input w-20 sm:w-24 rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ornamental divider */}
        <div className="ornament-divider">
          <span style={{ color: "var(--brass)", fontSize: "1.2rem" }}>⚜️</span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
          <button
            onClick={solveEquation}
            disabled={isAnimating}
            className="medieval-button rounded w-full sm:w-auto"
            style={{
              fontFamily: "'Cinzel', serif",
              opacity: isAnimating ? 0.7 : 1,
              cursor: isAnimating ? "not-allowed" : "pointer",
            }}
          >
            {isAnimating ? "🔄 ĐANG GIẢI MÃ..." : "⚔️ GIẢI MÃ PHƯƠNG TRÌNH"}
          </button>

          {hasResult && (
            <button
              onClick={resetAll}
              className="medieval-button rounded w-full sm:w-auto"
              style={{
                fontFamily: "'Cinzel', serif",
                background:
                  "linear-gradient(180deg, #5d4037 0%, #4e342e 40%, #3e2723 60%, #5d4037 100%)",
                borderColor: "var(--wood-light)",
                fontSize: "0.85rem",
                padding: "12px 24px",
              }}
            >
              🔄 BÀI MỚI
            </button>
          )}
        </div>

        {/* Result Panel */}
        {steps.length > 0 && (
          <div className="mt-8">
            <div className="ornament-divider">
              <span style={{ color: "var(--brass)", fontSize: "1rem" }}>
                📜
              </span>
            </div>

            <h3
              className="text-center text-lg sm:text-xl font-bold mb-4"
              style={{
                fontFamily: "'Cinzel', serif",
                color: "var(--blood-red)",
              }}
            >
              🏰 CUỘC HÀNH TRÌNH GIẢI MÃ
            </h3>

            <div className="result-panel rounded-lg p-4 sm:p-6">
              <div className="result-scroll">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="step-item mb-4 last:mb-0"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div
                      className="text-xs sm:text-sm font-bold mb-1 uppercase tracking-wider"
                      style={{
                        fontFamily: "'Cinzel', serif",
                        color: step.isError
                          ? "var(--blood-red)"
                          : step.isResult
                          ? "var(--gold-dark)"
                          : "var(--brass-dark)",
                      }}
                    >
                      {step.label}
                    </div>
                    <div
                      className={`text-sm sm:text-base p-3 rounded ${
                        step.isResult
                          ? "magic-glow"
                          : ""
                      }`}
                      style={{
                        fontFamily: "'MedievalSharp', cursive",
                        color: step.isError
                          ? "var(--blood-red)"
                          : step.isResult
                          ? "var(--blood-red)"
                          : "var(--ink)",
                        background: step.isResult
                          ? "linear-gradient(135deg, rgba(184, 134, 11, 0.1), rgba(255, 215, 0, 0.05))"
                          : step.isHighlight
                          ? "rgba(184, 134, 11, 0.08)"
                          : "transparent",
                        border: step.isResult
                          ? "2px solid var(--brass)"
                          : step.isHighlight
                          ? "1px solid rgba(184, 134, 11, 0.3)"
                          : "1px solid rgba(184, 134, 11, 0.1)",
                        fontWeight: step.isResult ? 700 : 400,
                        fontSize: step.isResult ? "1.1rem" : undefined,
                        whiteSpace: "pre-line",
                        lineHeight: step.isResult ? "1.8" : "1.6",
                      }}
                    >
                      {step.content}
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className="w-full h-px my-3"
                        style={{
                          background:
                            "linear-gradient(90deg, transparent, var(--brass-dark), transparent)",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Final flourish */}
            {hasResult && (
              <div className="text-center mt-4">
                <p
                  className="text-xs italic"
                  style={{
                    fontFamily: "'MedievalSharp', cursive",
                    color: "rgba(93, 64, 55, 0.5)",
                  }}
                >
                  ✨ Phép thuật đã hoàn thành ✨
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-8 text-center relative z-10">
        <p
          className="text-xs"
          style={{
            fontFamily: "'MedievalSharp', cursive",
            color: "rgba(244, 228, 193, 0.3)",
          }}
        >
          ⚔️ Forged in the fires of Algebra ⚔️
        </p>
      </div>
    </div>
  );
}

export default App;
