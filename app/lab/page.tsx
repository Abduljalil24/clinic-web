"use client";

import { useMemo, useState } from "react";

type LabCategory = {
  title: string;
  icon: string;
  tests: string[];
};

const PRIMARY = "#8B0000";
const SECONDARY = "#C04040";

const categories: LabCategory[] = [
  {
    title: "الكيمياء الحيوية",
    icon: "🧪",
    tests: [
      "CK",
      "CK-MB",
      "D.Dimer",
      "GOT",
      "Troponin I (Test device)",
      "Troponin T (Test device)",
      "24 hrs Urine protein",
      "Alb / Creatinine ratio",
      "CR.Clearance",
      "FBS",
      "GGTT",
      "HbA1C",
      "LDH",
      "PPBS",
      "RBS",
      "Uric Acid",
      "Alk. Phosphatase",
      "Direct Bilirubin",
      "SGOT (ASAT)",
      "SGPT (ALAT)",
      "Total Bilirubin",
      "24 hrs Metanephrines",
      "Albumin",
      "Ammonia",
      "Folic acid",
      "Gamma-GT",
      "Indirect Bilirubin",
      "Total Protein",
      "Cholesterol",
      "HDL - Cholesterol",
      "LDL - Cholesterol",
      "Triglycerides",
      "S. Creatinine",
      "S. Urea",
      "Calcium",
      "Chloride",
      "Magnesium",
      "Phosphorus",
      "Potassium",
      "Sodium",
      "Zinc level",
    ],
  },
  {
    title: "أمراض الدم",
    icon: "🩸",
    tests: [
      "ESR 1 hr",
      "Hb",
      "A.P.T.T Control",
      "A.P.T.T Patient",
      "B.T",
      "C.T",
      "INR",
      "P.T Control",
      "P.T Patient",
      "Malaria",
      "G6PD",
      "L.E CELLS",
      "Sickling test",
      "Blood Group",
    ],
  },
  {
    title: "السيرولوجي",
    icon: "🧬",
    tests: [
      "Brucella melitensis",
      "Salmonella Typhi O",
      "Salmonella Typhi H",
      "Widal test",
      "A.S.O",
      "Anti-D.N.A",
      "C.R.P",
      "Direct Coombs test",
      "Indirect Coombs test",
      "Infectious Mononucleosis (monospot test)",
      "Leishmania (formal gel test)",
      "Malaria Ag",
      "Pregnancy test",
      "R.F",
      "Toxoplasmosis IgG Cassette",
      "Toxoplasmosis IgM Cassette",
      "Tuberculin Test",
      "V.D.R.L",
      "CMV IGG",
      "CMV IGM",
      "Rubella IGG",
      "Rubella IGM",
      "H.Pylori",
      "H.Pylori Stool",
      "HBs Ag cassette",
      "HCV Ab cassette",
      "HIV 1&2 cassette",
      "T.B Rapid Test",
    ],
  },
  {
    title: "ELISA",
    icon: "🔬",
    tests: [
      "AFP",
      "CA125",
      "CA15.3",
      "CA19-9",
      "CEA",
      "PSA Free",
      "TPSA",
      "Anti-CCP",
      "Brucella IgG",
      "Brucella IgM",
      "HAV IGG",
      "HBc IgM",
      "HBe Ab",
      "HBe Ag",
      "HBs -Ag",
      "HBs Abs",
      "HBs Ag",
      "HCV",
      "HEV Abs Total",
      "HIV",
      "Vit-D",
      "Vitamin D3 (25-OH)",
      "Anti - Gliadin IgA",
      "Anti - Gliadin IgG",
      "Anti - Phospholipid IgG",
      "Anti - Phospholipid IgM",
      "Anti-cardiolipin IgG",
      "Anti-cardiolipin IgG-IgM-IgA",
      "Anti-cardiolipin IgM",
      "Anti-Cyclic Citruline Peptide",
      "Anti-soluble liver Ag",
      "Anti-t transglutaminase IgA",
      "Anti-t transglutaminase IgG",
      "B.HCG",
      "B2 - Microglobulin",
      "C-peptide",
      "CMV IgG",
      "CMV IgM",
      "D.Dimer",
      "Echinococcus Abs",
      "Ferritin Assay",
      "Folic acid",
      "H.pylori Ag",
      "H.pylori IgA",
      "H.pylori IgG",
      "HbA1c",
      "HBc IgG",
      "Herpes Simplex I & II IgG",
      "Herpes Simplex I & II IgM",
      "IgE",
      "Leishmania IgG",
      "LKM-1 abs",
      "Lupus Anticoagulant",
      "Mumps IgG",
      "Rubella IgG",
      "Rubella IgM",
      "S.Schistosoma IgG",
      "Toxo IgG",
      "Toxo IgM",
      "Varicella IgG",
      "Vit.B12",
      "AMA",
      "ANA",
      "ANCA",
      "Anti DNA",
      "ASMA",
      "c-ANCA",
      "LKM",
      "p.ANCA",
      "Depakin (Valporic acid)",
      "Digoxin",
      "Phenobarbital",
      "Phenobarbital 2nd",
      "Phenytoin (Epanutin)",
      "Tegretol (Carbamazepin)",
    ],
  },
  {
    title: "تحاليل الهرمونات",
    icon: "💗",
    tests: [
      "ACTH",
      "Cortisol after 30 min of stimulation",
      "Cortisol after 90 min of stimulation",
      "Cortisol AM",
      "Cortisol Fasting",
      "Cortisol PM",
      "DHEA-S",
      "Estradiol",
      "Estrogen",
      "FSH",
      "LH",
      "Progesterone",
      "Prolactin",
      "Testosterone",
      "Testosterone (Elecsys)",
      "Anti Thyroglobulin",
      "Anti Thyroid Perioxidase",
      "FT3",
      "FT4",
      "LH/FSH ratio",
      "Thyroglobulin",
      "TSH",
      "AMH",
      "15 min exercise Growth Hormone",
      "24 hrs Urine Cortisol",
      "Fasting Growth Hormone",
      "Growth Hormone",
      "Growth Hormone after Stimulation",
      "Parathyroid hormone",
    ],
  },
  {
    title: "الميكروبيولوجي",
    icon: "🦠",
    tests: [
      "Giemsa stain",
      "KOH preparation revealed",
      "KOH Test",
      "Skin scraping for Fungi",
      "Skin scraping for leishmania",
      "Specimen source",
    ],
  },
  {
    title: "سوائل الجسم",
    icon: "💧",
    tests: [
      "Appearance",
      "Cells Count",
      "Protien",
      "Sugar",
      "Colour",
      "T.WBC's",
      "Gram's Stain",
    ],
  },
  {
    title: "IMMINOFLOURISCENT ASSAY",
    icon: "✨",
    tests: ["AMA", "ANA", "ANCA", "AntiDNA", "ASMA"],
  },
  {
    title: "فحوصات أخرى",
    icon: "➕",
    tests: ["Pap smear", "Polypectomy", "Semen", "Stool", "Urine", "test cholerae"],
  },
];

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div style={{ marginBottom: "14px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div
          style={{
            width: "5px",
            height: "32px",
            borderRadius: "10px",
            background: `linear-gradient(180deg, ${PRIMARY}, ${SECONDARY})`,
            flexShrink: 0,
          }}
        />
        <h1
          style={{
            margin: 0,
            fontSize: "2rem",
            color: PRIMARY,
          }}
        >
          {title}
        </h1>
      </div>

      {subtitle && (
        <p
          style={{
            margin: "8px 17px 0 0",
            color: "var(--text-soft)",
            fontSize: "0.97rem",
            lineHeight: 1.9,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

function TestItem({ test }: { test: string }) {
  return (
    <div
      style={{
        marginBottom: "8px",
        padding: "12px 14px",
        background: "#FDF9F6",
        borderRadius: "16px",
        border: "1px solid rgba(139,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      <div
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          background: SECONDARY,
          flexShrink: 0,
        }}
      />
      <div
        style={{
          color: "var(--text)",
          fontSize: "0.95rem",
          lineHeight: 1.6,
          fontWeight: 500,
          wordBreak: "break-word",
        }}
      >
        {test}
      </div>
    </div>
  );
}

function CategoryCard({
  category,
  open,
  onToggle,
}: {
  category: LabCategory;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        marginBottom: "14px",
        background: "white",
        borderRadius: "22px",
        border: "1.1px solid rgba(139,0,0,0.10)",
        boxShadow:
          "0 5px 12px rgba(0,0,0,0.03), 0 3px 8px rgba(139,0,0,0.04)",
        overflow: "hidden",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        style={{
          width: "100%",
          background: "white",
          color: "inherit",
          boxShadow: "none",
          border: "none",
          borderRadius: 0,
          padding: "16px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          textAlign: "right",
        }}
      >
        <div
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "16px",
            background:
              "linear-gradient(135deg, rgba(139,0,0,0.14), rgba(139,0,0,0.05))",
            border: "1px solid rgba(139,0,0,0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.5rem",
            flexShrink: 0,
          }}
        >
          {category.icon}
        </div>

        <div style={{ flex: 1 }}>
          <div
            style={{
              color: PRIMARY,
              fontWeight: 800,
              fontSize: "1.05rem",
              marginBottom: "6px",
            }}
          >
            {category.title}
          </div>
          <div
            style={{
              color: "var(--text-soft)",
              fontSize: "0.86rem",
              fontWeight: 600,
            }}
          >
            {category.tests.length} فحص
          </div>
        </div>

        <div
          style={{
            fontSize: "1.1rem",
            color: PRIMARY,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.25s ease",
            flexShrink: 0,
          }}
        >
          ⌄
        </div>
      </button>

      {open && (
        <div
          style={{
            padding: "0 12px 14px 12px",
          }}
        >
          {category.tests.map((test) => (
            <TestItem key={`${category.title}-${test}`} test={test} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function LabPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    {}
  );

  const filteredCategories = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    if (!q) return categories;

    return categories
      .map((category) => {
        const filteredTests = category.tests.filter((test) =>
          test.toLowerCase().includes(q)
        );

        if (category.title.toLowerCase().includes(q)) {
          return category;
        }

        return {
          ...category,
          tests: filteredTests,
        };
      })
      .filter((category) => category.tests.length > 0);
  }, [searchQuery]);

  const toggleCategory = (title: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div className="section-container" style={{ maxWidth: "980px" }}>
      <div style={{ marginBottom: "18px" }}>
        <SectionTitle
          title="فحوصات المختبر"
          subtitle="يمكنك تصفح جميع الفحوصات المتوفرة في المختبر حسب القسم."
        />
      </div>

      {/* البحث */}
      <div
        style={{
          marginBottom: "18px",
          background: "white",
          borderRadius: "18px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "relative" }}>
          <span
            style={{
              position: "absolute",
              right: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: PRIMARY,
              fontSize: "1.1rem",
            }}
          >
            🔍
          </span>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن اسم الفحص..."
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "white",
              padding: "16px 48px 16px 48px",
              fontSize: "1rem",
            }}
          />

          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              style={{
                position: "absolute",
                left: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                width: "34px",
                height: "34px",
                borderRadius: "50%",
                padding: 0,
                background: "transparent",
                color: "var(--text-soft)",
                boxShadow: "none",
                border: "none",
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* النتائج */}
      {filteredCategories.length === 0 ? (
        <div
          className="card"
          style={{
            textAlign: "center",
            padding: "28px",
            borderRadius: "22px",
          }}
        >
          <div
            style={{
              fontSize: "3rem",
              marginBottom: "12px",
            }}
          >
            🔎
          </div>
          <div
            style={{
              color: PRIMARY,
              fontWeight: 800,
              fontSize: "1.2rem",
              marginBottom: "8px",
            }}
          >
            لا توجد نتائج
          </div>
          <div
            style={{
              color: "var(--text-soft)",
              fontSize: "0.95rem",
            }}
          >
            جرّب البحث باسم فحص آخر.
          </div>
        </div>
      ) : (
        <div>
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.title}
              category={category}
              open={!!openCategories[category.title]}
              onToggle={() => toggleCategory(category.title)}
            />
          ))}
        </div>
      )}
    </div>
  );
}