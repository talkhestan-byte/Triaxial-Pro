
/*
 * Triaxial Pro - UU Charts
 * File: charts/uu-charts.js
 * Dependency: calculations/uu.js
 *
 * API:
 * TriaxialUUCharts.renderStressStrain(container, specimens, options)
 * TriaxialUUCharts.renderMohrCircles(container, specimens, envelope, options)
 *
 * specimen:
 * {
 *   name: "Specimen 1",
 *   diameter: 38,             // mm
 *   height: 76,               // mm
 *   confiningPressure: 100,   // kPa
 *   readings: [
 *     { displacement: 0, load: 0 },
 *     { displacement: 1, load: 0.4 }
 *   ],
 *   areaCorrection: true,
 *   loadCorrectionN: 0
 * }
 */
(function (global) {
  "use strict";

  const COLORS = [
    "#1687d9", "#e58b28", "#159b72",
    "#a05acb", "#d94f65", "#65758b"
  ];

  const NS = "http://www.w3.org/2000/svg";

  function getElement(target) {
    if (typeof target === "string") {
      return document.querySelector(target);
    }
    return target;
  }

  function asArray(value) {
    return Array.isArray(value) ? value : [value];
  }

  function number(value, label) {
    const n = Number(value);
    if (!Number.isFinite(n)) {
      throw new Error("Invalid value: " + label);
    }
    return n;
  }

  function calculateSpecimen(specimen, index) {
    if (!specimen || typeof specimen !== "object") {
      throw new Error("Invalid specimen at index " + index);
    }

    const d = number(specimen.diameter, "diameter");
    const h = number(specimen.height, "height");
    const sigma3 = number(specimen.confiningPressure, "confiningPressure");
    const correctionN = number(specimen.loadCorrectionN ?? 0, "loadCorrectionN");

    if (d <= 0 || h <= 0 || sigma3 < 0) {
      throw new Error("Diameter and height must be positive; confining pressure cannot be negative.");
    }

    if (!Array.isArray(specimen.readings) || specimen.readings.length < 2) {
      throw new Error("Each specimen needs at least two readings.");
    }

    const initialArea = Math.PI * d * d / 4;
    const useAreaCorrection = specimen.areaCorrection !== false;

    const points = specimen.readings.map((reading, readingIndex) => {
      const displacement = number(reading.displacement, "displacement");
      const loadKN = number(reading.load, "load");

      const strain = displacement / h;

      if (strain < 0 || strain >= 1) {
        throw new Error("Invalid axial strain in specimen " + (index + 1));
      }

      const correctedArea = useAreaCorrection
        ? initialArea / (1 - strain)
        : initialArea;

      const loadN = loadKN * 1000 - correctionN;

      if (loadN < 0) {
        throw new Error("Corrected load cannot be negative.");
      }

      const q = (loadN / correctedArea) * 1000;

      return {
        readingIndex,
        displacement,
        strain,
        strainPercent: strain * 100,
        loadKN,
        correctedArea,
        q,
        sigma1: sigma3 + q
      };
    });

    const peak = points.reduce((best, point) =>
      point.q > best.q ? point : best
    , points[0]);

    return {
      name: specimen.name || ("Specimen " + (index + 1)),
      sigma3,
      points,
      peak,
      su: peak.q / 2
    };
  }

  function niceMax(value) {
    if (!Number.isFinite(value) || value <= 0) return 1;
    const magnitude = Math.pow(10, Math.floor(Math.log10(value)));
    const scaled = value / magnitude;
    const step = scaled <= 1 ? 1 :
                 scaled <= 2 ? 2 :
                 scaled <= 5 ? 5 : 10;
    return step * magnitude;
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function chartShell(title, width, height, content) {
    return `
      <div class="triaxial-chart" style="
        width:100%; overflow:hidden; direction:ltr;
        font-family:Arial,sans-serif; color:var(--text-color,#263445);
      ">
        <div style="
          font-size:15px;font-weight:700;text-align:center;
          margin:8px 0 12px;direction:auto;
        ">${escapeHTML(title)}</div>
        <svg viewBox="0 0 ${width} ${height}"
             role="img"
             aria-label="${escapeHTML(title)}"
             style="display:block;width:100%;height:auto;max-width:100%;">
          ${content}
        </svg>
      </div>`;
  }

  function axesMarkup({
    width, height, left, right, top, bottom,
    xMax, yMax, xLabel, yLabel, xTicks = 5, yTicks = 5
  }) {
    let markup = "";

    for (let i = 0; i <= xTicks; i++) {
      const x = left + (width - left - right) * i / xTicks;
      const value = xMax * i / xTicks;

      markup += `
        <line x1="${x}" y1="${top}" x2="${x}" y2="${height - bottom}"
              stroke="#dce3eb" stroke-width="1"/>
        <text x="${x}" y="${height - bottom + 22}"
              text-anchor="middle" font-size="11" fill="#526273">
          ${value.toFixed(xMax < 10 ? 1 : 0)}
        </text>`;
    }

    for (let i = 0; i <= yTicks; i++) {
      const y = height - bottom - (height - top - bottom) * i / yTicks;
      const value = yMax * i / yTicks;

      markup += `
        <line x1="${left}" y1="${y}" x2="${width - right}" y2="${y}"
              stroke="#dce3eb" stroke-width="1"/>
        <text x="${left - 10}" y="${y + 4}"
              text-anchor="end" font-size="11" fill="#526273">
          ${value.toFixed(yMax < 10 ? 1 : 0)}
        </text>`;
    }

    markup += `
      <line x1="${left}" y1="${top}" x2="${left}" y2="${height - bottom}"
            stroke="#526273" stroke-width="1.5"/>
      <line x1="${left}" y1="${height - bottom}" x2="${width - right}"
            y2="${height - bottom}" stroke="#526273" stroke-width="1.5"/>
      <text x="${(left + width - right) / 2}" y="${height - 12}"
            text-anchor="middle" font-size="12" fill="currentColor">
        ${escapeHTML(xLabel)}
      </text>
      <text transform="translate(18 ${(top + height - bottom) / 2}) rotate(-90)"
            text-anchor="middle" font-size="12" fill="currentColor">
        ${escapeHTML(yLabel)}
      </text>`;

    return markup;
  }

  function renderStressStrain(container, specimens, options = {}) {
    const target = getElement(container);
    if (!target) throw new Error("Stress-strain chart container was not found.");

    const input = asArray(specimens);
    const results = input.map(calculateSpecimen);

    const width = 900;
    const height = 480;
    const left = 85;
    const right = 30;
    const top = 28;
    const bottom = 70;

    const maxStrain = niceMax(Math.max(
      ...results.flatMap(item => item.points.map(point => point.strainPercent))
    ) * 1.08);

    const maxStress = niceMax(Math.max(
      ...results.flatMap(item => item.points.map(point => point.q))
    ) * 1.08);

    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;

    const x = value => left + (value / maxStrain) * plotWidth;
    const y = value => height - bottom - (value / maxStress) * plotHeight;

    let content = axesMarkup({
      width, height, left, right, top, bottom,
      xMax: maxStrain, yMax: maxStress,
      xLabel: options.xLabel || "Axial strain (%)",
      yLabel: options.yLabel || "Deviator stress q (kPa)"
    });

    results.forEach((result, i) => {
      const color = COLORS[i % COLORS.length];

      const path = result.points.map((point, j) =>
        `${j === 0 ? "M" : "L"} ${x(point.strainPercent).toFixed(2)} ${y(point.q).toFixed(2)}`
      ).join(" ");

      content += `
        <path d="${path}" fill="none" stroke="${color}"
              stroke-width="2.8" stroke-linejoin="round"
              stroke-linecap="round"/>
        <circle cx="${x(result.peak.strainPercent)}"
                cy="${y(result.peak.q)}" r="5"
                fill="${color}" stroke="#fff" stroke-width="1.5">
          <title>${escapeHTML(result.name)}: peak q = ${result.peak.q.toFixed(2)} kPa</title>
        </circle>`;
    });

    const legendStart = Math.max(top + 8, 48);
    results.forEach((result, i) => {
      const color = COLORS[i % COLORS.length];
      const rowY = legendStart + i * 23;

      content += `
        <line x1="${width - right - 190}" y1="${rowY}"
              x2="${width - right - 165}" y2="${rowY}"
              stroke="${color}" stroke-width="3"/>
        <text x="${width - right - 157}" y="${rowY + 4}"
              font-size="11" fill="currentColor">
          ${escapeHTML(result.name)}
        </text>`;
    });

    target.innerHTML = chartShell(
      options.title || "UU Stress–Strain Curve",
      width, height, content
    );

    return results;
  }

  function renderMohrCircles(container, specimens, envelope = {}, options = {}) {
    const target = getElement(container);
    if (!target) throw new Error("Mohr chart container was not found.");

    const results = asArray(specimens).map(calculateSpecimen);

    if (!results.length) {
      throw new Error("At least one specimen is required.");
    }

    const phiDeg = number(envelope.phiDeg ?? 0, "phiDeg");
    const cohesion = number(
      envelope.cohesion ?? results.reduce((sum, item) => sum + item.su, 0) / results.length,
      "cohesion"
    );

    if (phiDeg < 0 || phiDeg >= 90 || cohesion < 0) {
      throw new Error("Invalid Mohr-Coulomb envelope parameters.");
    }

    const width = 900;
    const height = 500;
    const left = 85;
    const right = 35;
    const top = 30;
    const bottom = 75;

    const maxSigma = niceMax(Math.max(
      ...results.map(item => item.peak.sigma1)
    ) * 1.15);

    const phiRad = phiDeg * Math.PI / 180;
    const envelopeMax = cohesion + maxSigma * Math.tan(phiRad);
    const maxTau = niceMax(Math.max(
      ...results.map(item => item.peak.q / 2),
      envelopeMax
    ) * 1.15);

    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;

    const x = value => left + (value / maxSigma) * plotWidth;
    const y = value => height - bottom - (value / maxTau) * plotHeight;

    let content = axesMarkup({
      width, height, left, right, top, bottom,
      xMax: maxSigma, yMax: maxTau,
      xLabel: options.xLabel || "Normal stress σ (kPa)",
      yLabel: options.yLabel || "Shear stress τ (kPa)"
    });

    results.forEach((result, i) => {
      const sigma3 = result.sigma3;
      const sigma1 = result.peak.sigma1;
      const center = (sigma1 + sigma3) / 2;
      const radius = (sigma1 - sigma3) / 2;
      const color = COLORS[i % COLORS.length];

      let circlePath = "";

      for (let j = 0; j <= 100; j++) {
        const angle = Math.PI * 2 * j / 100;
        const sigma = center + radius * Math.cos(angle);
        const tau = radius * Math.sin(angle);

        circlePath += `${j === 0 ? "M" : "L"} ${x(sigma).toFixed(2)} ${y(tau).toFixed(2)} `;
      }

      content += `
        <path d="${circlePath} Z" fill="${color}" fill-opacity="0.08"
              stroke="${color}" stroke-width="2.4"/>
        <circle cx="${x(sigma3)}" cy="${y(0)}" r="3.5" fill="${color}"/>
        <circle cx="${x(sigma1)}" cy="${y(0)}" r="3.5" fill="${color}"/>
        <title>${escapeHTML(result.name)}: σ3=${sigma3.toFixed(2)}, σ1=${sigma1.toFixed(2)} kPa</title>`;
    });

    // Mohr-Coulomb failure envelope: tau = c + sigma * tan(phi)
    const envelopePath = `
      M ${x(0)} ${y(cohesion)}
      L ${x(maxSigma)} ${y(envelopeMax)}
    `;

    content += `
      <path d="${envelopePath}" fill="none"
            stroke="#d34d4d" stroke-width="2.5"
            stroke-dasharray="8 5"/>
      <text x="${x(maxSigma) - 8}" y="${y(envelopeMax) - 9}"
            text-anchor="end" font-size="11" fill="#d34d4d">
        τ = c + σ tan φ
      </text>`;

    const legendY = top + 18;
    results.forEach((result, i) => {
      const color = COLORS[i % COLORS.length];
      const rowY = legendY + i * 22;

      content += `
        <line x1="${width - right - 195}" y1="${rowY}"
              x2="${width - right - 173}" y2="${rowY}"
              stroke="${color}" stroke-width="3"/>
        <text x="${width - right - 165}" y="${rowY + 4}"
              font-size="11" fill="currentColor">
          ${escapeHTML(result.name)}
        </text>`;
    });

    target.innerHTML = chartShell(
      options.title || "Mohr Circles at Failure",
      width, height, content
    );

    return {
      specimens: results,
      envelope: { cohesion, phiDeg },
      assumptions: [
        "Mohr circles are calculated from total stresses.",
        "The failure envelope is the user-supplied Mohr-Coulomb line.",
        "For a φu = 0 analysis, use φ = 0 and an appropriate undrained strength."
      ]
    };
  }

  global.TriaxialUUCharts = {
    calculateSpecimen,
    renderStressStrain,
    renderMohrCircles
  };

})(window);
