import { useState } from 'react';
import PropTypes from 'prop-types';
import { HiSearch } from 'react-icons/hi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import notifyOptions from 'components/NotifyOptions/NotifyOptions';
import css from './Searchbar.module.css';

export default function Searchbar({ onSubmit }) {
  const [query, setQuery] = useState('');

  const onInputChange = e => {
    setQuery(e.currentTarget.value.toLowerCase());
  };

  const onFormSubmit = event => {
    event.preventDefault();
    if (query.trim() === '') {
      toast.error('Enter your search request, please!', notifyOptions);
      return;
    }
    onSubmit(query);
    setQuery('');
  };

  return (
    <header className={css.searchbar}>
      <form className={css.form} onSubmit={onFormSubmit}>
        <input
          className={css.input}
          name="query"
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          onChange={onInputChange}
          value={query}
        />
        <button type="submit" className={css.searchBtn}>
          <span>
            <HiSearch size={40} />
          </span>
        </button>
      </form>
    </header>
  );
}

Searchbar.propTypes = {
  onSubmit: PropTypes.func,
};
