import React, { useState, useEffect } from "react";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";
import fr from "i18n-iso-countries/langs/fr.json";

countries.registerLocale(en);
countries.registerLocale(fr);

const CountryModal = ({ isOpen, onClose, onSelectCountry }: any) => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [showAllCountries, setShowAllCountries] = useState(false);
  const [countryList, setCountryList] = useState<
    { code: string; name: string }[]
  >([]);

  useEffect(() => {
    // Récupérer les pays en français
    const countryObj = countries.getNames("fr", { select: "official" });
    const countryArr = Object.entries(countryObj).map(([code, name]) => ({
      code,
      name,
    }));

    // Trier la liste par ordre alphabétique
    const sortedCountryArr = countryArr.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    setCountryList(sortedCountryArr);
  }, []);

  const handleCountryChange = (event: any) => {
    const value = event.target.value;
    if (value === "OTHER") {
      setShowAllCountries(true);
      setSelectedCountry(""); // Reset selected country when "Autres" is selected
    } else {
      setSelectedCountry(value);
    }
  };

  const handleSubmit = () => {
    onSelectCountry(selectedCountry);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl mb-4">Sélectionnez votre pays de résidence</h2>
        <select
          value={selectedCountry}
          onChange={handleCountryChange}
          className="mb-4 p-2 border"
        >
          {!showAllCountries && (
            <>
              <option value="">Sélectionnez un pays</option>
              <option value="FR">France</option>
              <option value="US">États-Unis</option>
              <option value="OTHER">Autres</option>
            </>
          )}
          {showAllCountries && (
            <>
              <option value="">Sélectionnez un pays</option>
              {countryList.map((country) => (
                <option
                  key={country.code}
                  value={country.code}
                  onClick={handleCountryChange}
                >
                  {country.name}
                </option>
              ))}
            </>
          )}
        </select>
        <div className="flex justify-end">
          <button onClick={onClose} className="mr-2 p-2 bg-gray-300 rounded">
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="p-2 bg-blue-500 text-white rounded"
            disabled={!selectedCountry} // Disable if no country is selected
          >
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default CountryModal;
