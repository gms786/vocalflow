/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0b0b10",
        slate: "#11141f",
        electric: "#7df9ff",
        ember: "#ff7a18",
        neon: "#00f5a0"
      },
      boxShadow: {
        glow: "0 0 40px rgba(125, 249, 255, 0.25)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        },
        pulseRing: {
          "0%": { boxShadow: "0 0 0 0 rgba(125, 249, 255, 0.35)" },
          "70%": { boxShadow: "0 0 0 18px rgba(125, 249, 255, 0)" },
          "100%": { boxShadow: "0 0 0 0 rgba(125, 249, 255, 0)" }
        },
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0px)" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseRing: "pulseRing 1.6s ease-out infinite",
        fadeIn: "fadeIn 0.4s ease-out"
      }
    }
  },
  plugins: []
};
