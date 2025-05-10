// components/FAQSection.jsx
import FAQ from "./ui/FAQ";

const FAQSection = ({ faqs }) => {
  return (
    <section className="py-10 px-4 mx-auto">
      {/* <h1 className="text-2xl font-bold mb-6 text-center">{heading}</h1> */}
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQ key={index} title={faq.title} description={faq.description} />
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
