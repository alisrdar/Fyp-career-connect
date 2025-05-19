"use client"
import React from 'react'
import Navbar from '@/components/Navbar'
import ContactText from '@/components/ContactText'
import ContactCard from '@/components/ContactCard'
import { Mail, Phone, MapPin } from 'lucide-react'
import Hero from '@/components/Hero'
import Image from 'next/image'
import ContactForm from '@/components/forms/ContactForm'
import { emailValidation } from '@/lib/validateForm'
import Footer from '@/components/footer'
import Banner from '@/components/banner'


const Contact = () => {

  const contactList = [
    { Icon: Mail, title: "Email", message: "Email Us", contact: "careerconnect@gmail.com" },
    { Icon: Phone, title: "Phone", message: "Call Us", contact: "051 45607890" },
    { Icon: MapPin, title: "Office", message: "Islamabad", contact: "Get in touch >" },
  ]
  const miniContactList = [
    { Icon: Mail, contact: "careerconnect@gmail.com" },
    { Icon: Phone, contact: "051 45607890" },
    { Icon: MapPin, message: "Islamabad" },
  ]


  const contactFields = [
    {
      name: "firstName",
      label: "First name",
      placeholder: "Jane",
      validation: { required: "First name is required" },
    },
    {
      name: "lastName",
      label: "Last name",
      placeholder: "Doe",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "jane@example.com",
      validation: { ...emailValidation },
    },
    {
      name: "phone",
      label: "Phone number",
      placeholder: "+1 234 567 890",
    },
    {
      name: "topic",
      label: "Choose a topic",
      type: "select",
      options: ["General", "Support", "Feedback"],
      placeholder: "Select one",
      validation: { required: "Please select a topic" },
    },
    {
      name: "description",
      label: "Which best describes you?",
      type: "radio",
      options: [
        "High school student",
        "Middle School student",
        "College undergraduate",
        "Graduate student",
        "Parent / Guardian",
        "Other",
      ],
      validation: { required: "Please select one" },
    },
    {
      name: "message",
      label: "Message",
      type: "textarea",
      placeholder: "Type your message.",
      validation: { required: "Message is required" },
    },
    {
      name: "terms",
      label: "I accept the Terms",
      type: "checkbox",
      validation: { required: "You must accept the terms" },
    },
  ];
  const handleContactSubmit = async (data, setError) => {
    try {
      console.log("Send to API:", data);
      // await sendContactMessage(data)
      return true;
    } catch (error) {
      setError("formError", { message: "Something went wrong. Try again." });
      return false;
    }
  };

  return (
    <>
      <Navbar />
      <div className=''>
        <section>
        <Hero
          title={"Unlock Your Potential "}
          description={"Welcome to our career counseling platform. We are here to guide you towards succss."}
          buttonText={"Learn More"}
        />
      </section>
      <section className='my-12  px-6 '>
        <ContactText />
      </section>

      <section className='my-12 px-6'>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-32 py-6 lg:px-8">
          {/* Contact Cards */}
          <div className="flex flex-col gap-10">
            {contactList.map((item) => (
              <ContactCard key={item.title} {...item} />
            ))}
          </div>

          {/* Image Section */}
          <div className="p-2 rounded-xl col-span-1 lg:col-span-2 dark:bg-surface dark:border-border shadow-sm lg:h-full h-100 w-8/9 ml-auto">

            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6311.6026892901!2d72.72451446695352!3d33.78835652883327!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38dfa7edf75be731%3A0xb25856312ba59bc4!2sPunjab%20college%20of%20excellence%20in%20commerce%20wah%20cantt!5e0!3m2!1sen!2s!4v1747683268922!5m2!1sen!2s"
              width="100%"
              height="100%"
              className="rounded-xl border-0"
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>


          </div>
        </div>

      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-16 px-12 pr-18 py-16">
        <div className="flex flex-col gap-10">
          <ContactText
            title='Contact Us'
            description='Have a qustion? Reach out to us today'
          />
          <div className='px-2'>
            {miniContactList.map((item, key) => (
            <ContactCard
              key={key}
              {...item}
              flexDirection='row'
            />
          ))}
          </div>

        </div>
        <div className='w-8/9 ml-auto col-span-2 '>
          <ContactForm
            title="Reach Out to Us"
            btnText="Submit"
            gridFields={contactFields.slice(0, 4)}
            fields={contactFields.slice(4)}
            onSubmit={handleContactSubmit}
          />
        </div>


      </section>

      <section>
        <Banner
          title={"Unlock Your Career Potential Today"}
          description={"Discover the path to your dream career with our comprehensive career counseling services"}
        />
      </section>
      </div>
      <Footer />

    </>
  )
}

export default Contact
