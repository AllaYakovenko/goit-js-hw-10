import './css/styles.css';
import Notiflix, { Notify } from 'notiflix';
import fetchCountries from './fetchCountries';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const refs = {
    input: document.querySelector('#search-box'),
    countryList: document.querySelector('.country-list'),
    countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(evt) { 
    evt.preventDefault()
    
    const name = evt.target.value.trim();

    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';

    if (!name) { 
        return; 
    }

    fetchCountries(name)
    .then(countries => {
        if (countries.length > 10) {
            return Notify.info("Too many matches found. Please enter a more specific name.");
        }
        countryList(countries);
    })
        .catch(err => Notify.failure("Oops, there is no country with that name"));
}

function countryList(countries) { 
    if (countries.length === 1) {
        oneCountry(countries);
    } else { 
        manyCountries(countries);
    }
}


function oneCountry(country) { 
    const markup = country
        .map(({ flags, name, capital, population, languages }) => {
            return `<img src="${flags.svg}" alt="${name.official} flag" width="200px" height="100px"/>
                    <ul class="one-country__list">
                        <li class="one-country__item one-country__item--name">
                            <p>Name: ${name.official}</p></li>
                        <li class="one-country__item">
                            <p>Capital: ${capital}</p></li>
                        <li class="one-country__item">
                            <p>Population: ${population}</p></li>
                        <li class="one-country__item">
                            <p>Languages: ${Object.values(languages)}</p></li>
                    </ul>`;
        }).join('');
    refs.countryInfo.innerHTML = markup;
}

function manyCountries(countries) { 
    const markup = countries
        .map(({ flags, name }) => {
            return `<li class="countries-list__item">
                        <img class="countries-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = "50px" height = "50px" />
                            <p class="countries-list__name">${name.official}</p>
                    </li>`;
        }).join('');
    refs.countryInfo.innerHTML = markup;
}