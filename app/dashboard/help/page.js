"use client";
import { useState } from "react";
import { Search } from "lucide-react"; // ← use Lucide instead!
import FAQ from "@/components/ui/FAQ";
import BackToTopButton from "@/components/ui/BacktoTheTop";
import { faqs } from "@/lib/data/dashboardFAQs";


export default function HelpPage() {
  const [search, setSearch] = useState("");
  const filteredFaqs = faqs.filter(
    (f) =>
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-12">
      {/* Page Title */}
      <h1 className="text-4xl font-extrabold text-center text-background-dark dark:text-foreground-dark">
        Help Center
      </h1>

      {/* Getting Started */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-background-dark dark:text-foreground-dark">
          Getting Started
        </h2>
        <div className="bg-white dark:bg-surface p-6 rounded-lg shadow-md">
          <ul className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
            <li>
              Open the <strong>Survey</strong> tab and complete all questions.
            </li>
            <li>Wait for the scoring process to finish automatically.</li>
            <li>
              Go to <strong>Recommendations</strong> to view & download your
              report.
            </li>
          </ul>
        </div>
      </section>

      {/* FAQ with Search */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-background-dark dark:text-foreground-dark">
          Frequently Asked Questions
        </h2>

        {/* Search Input */}
        <div className="relative max-w-md">
          <Search className="absolute top-3 left-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none  dark:text-muted focus:ring-2 focus:ring-blue-400 dark:focus:ring-darkblue"
          />
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((f, idx) => (
              <FAQ key={idx} title={f.title} description={f.description} />
            ))
          ) : (
            <p className="text-gray-500">No FAQs match your search.</p>
          )}
        </div>
      </section>

      {/* Contact */}
      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Still have questions?</h2>
        <p className="text-gray-700 dark:text-gray-300">
          Email us at{" "}
          <a
            href="mailto:support@careerconnect.com"
            className="text-secondary hover:underline"
          >
            support@careerconnect.com
          </a>
        </p>
      </section>

      {/* Back to the top */}
      <BackToTopButton/>
    </div>
  );
}
