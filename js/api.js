

const getData = (onSuccess, onFail) => {
  fetch('https://25.javascript.htmlacademy.pro/keksobooking/data')
    .then((response) => response.json())
    .then((places) => {
      onSuccess(places);
    })
    .catch((error) => {
      onFail(error);
    });
};

const sendData = (onSuccess, onFail, body) => {
  fetch(
    'https://25.javascript.htmlacademy.pro/keksobooking',
    {
      method: 'POST',
      body,
    },
  )
    .then((response) => {
      if (response.ok) {
        onSuccess();
      } else {
        onFail();
      }
    })
    .catch(() => {
      onFail();
    });
};

export { getData, sendData };
