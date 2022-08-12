import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { Dropdown } from 'semantic-ui-react';
import { setLanguage } from '../../actions/translation';
import { LANG_NAMES } from '../../translations/translations';

const LanguageSwitcher = (props) => {
  const { currentLanguage, onSetLanguageAction } = props;

  const handleLanguageChange = (ln) => {
    console.log('Changing language to', ln);
    window.localStorage.setItem('appUILanguage', JSON.stringify(ln));
    onSetLanguageAction(ln);
  };

  return (
    <Dropdown item simple closeOnChange text={currentLanguage.name} className="languageselect">
      <Dropdown.Menu>
        {LANG_NAMES.map((language) => (
          <Dropdown.Item
            key={`language-${language.locale}`}
            onClick={() => handleLanguageChange(language)}
            id={`language_${language.locale}`}
            active={currentLanguage.locale === language.locale}
          >
            {language.name}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

const mapStateToProps = (state) => ({
  currentLanguage: state.language,
});

const mapDispatchToProps = (dispatch) => ({
  onSetLanguageAction: (value) => dispatch(setLanguage(value)),
});

const languageShape = {
  name: PropTypes.string.isRequired,
  locale: PropTypes.string.isRequired,
};

LanguageSwitcher.propTypes = {
  currentLanguage: PropTypes.shape(languageShape).isRequired,
  onSetLanguageAction: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(LanguageSwitcher);
