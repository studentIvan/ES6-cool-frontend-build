import './example.sass';
import goExample from './example';

export default goExample;

$(() => {
  moment.locale(navigator.language || navigator.userLanguage);
  $('span.example').html(`Today is ${moment().format('DD MMMM YYYY')}`);
});
