import { useEffect, useState } from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { TRANSLATIONS } from '../../translations/translations';

let gActiveLanguageCode;

const capitalizeString = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const getTranslation = (translationKey, capitalize = true) => {
  if (translationKey) {
    try {
      if (!capitalize) return TRANSLATIONS[gActiveLanguageCode][translationKey];
      return capitalizeString(TRANSLATIONS[gActiveLanguageCode][translationKey]);
    } catch (error) {
      return '';
    }
  }
  return '';
};

const Translatable = (props) => {
  const { capitalize, translationKey, locale } = props;
  const [translation, setTranslation] = useState('');

  const updateTranslation = (translateKey, activeLanguageCode) => {
    if (translateKey && activeLanguageCode) {
      try {
        setTranslation(TRANSLATIONS[activeLanguageCode][translateKey]);
        gActiveLanguageCode = activeLanguageCode;
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    updateTranslation(translationKey, locale);
  }, [translationKey, locale]);

  if (!translation) return null;
  if (!capitalize) return translation;
  return capitalizeString(translation);
};

const mapStateToProps = (state) => ({
  locale: state.language.locale,
});

Translatable.propTypes = {
  translationKey: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
  capitalize: PropTypes.bool,
};

Translatable.defaultProps = {
  capitalize: null,
};

export default connect(mapStateToProps, null)(Translatable);
