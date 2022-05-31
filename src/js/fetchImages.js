import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '27666563-e68b1d227a46c65a42bf27c59';
const url = `${BASE_URL}?key=${API_KEY}`;

export const fetchPicsOptions = {
  q: '',
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
};

export const fetchPics = async params =>
  await axios.get(url, { params }).catch(e => console.error(e));