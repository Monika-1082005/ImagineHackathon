import { useEffect } from 'react';

const GoogleTranslate = () => {
  useEffect(() => {
    // Ensure the script is added only once
    if (!window.googleTranslateLoaded) {
      const script = document.createElement('script');
      script.src = "https://translate.google.com/translate_a/element.js?cb=loadGoogleTranslate";
      script.async = true;
      document.body.appendChild(script);

      // Define the callback function
      window.loadGoogleTranslate = () => {
        new window.google.translate.TranslateElement(
          { pageLanguage: 'en' }, // Set source language
          'myid'
        );
      };

      // Mark the script as loaded to prevent duplicates
      window.googleTranslateLoaded = true;
    }
  }, []);

  return (
    <div
      id="myid"
      className="flex justify-center items-center py-3 bg-gray-100 border-b border-gray-300"
    ></div>
  );
};

export default GoogleTranslate;
