import './example.styl';

$(() => {
  moment.locale(navigator.language || navigator.userLanguage);
  $('span.example').html(`Today is ${moment().format('DD MMMM YYYY')}`);
});

export default function () {
  return '12312312345';
}
