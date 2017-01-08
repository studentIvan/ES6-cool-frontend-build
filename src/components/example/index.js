import './example.sass';

$(() => {
  moment.locale(navigator.language || navigator.userLanguage);
  $('span.example').html(`Today is ${moment().format('DD MMMM YYYY')}`);
});

export default function goExample() {
  return '12312312345';
}
