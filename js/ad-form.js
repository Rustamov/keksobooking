import { isEscapeKey, showAlert } from "./util.js";

const formNode = document.querySelector('.ad-form');
const avatarInput = formNode.querySelector('#avatar');
const plcaePhotosInput = formNode.querySelector('#images');
const submitButton = formNode.querySelector('.ad-form__submit');
const addressInput = formNode.querySelector('#address');

const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png', 'webp'];

const pristine = new Pristine(formNode, {
  classTo: 'ad-form__element',
  errorTextParent: 'ad-form__element',
  errorTextClass: 'img-upload__error',
});



const adFormInit = () => {
  formNode.classList.remove('ad-form--disabled');
};

avatarInput.addEventListener('change', () => {
  const file = avatarInput.files[0];
  const fileName = file.name.toLowerCase();
  const avatarPicture = formNode.querySelector('.ad-form-header__preview img');

  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

  if (matches) {
    avatarPicture.src = URL.createObjectURL(file);
  } else {
    showAlert('Выберите подходящюю картинку');
  }
});

plcaePhotosInput.addEventListener('change', () => {
  const files = plcaePhotosInput.files;
  const adPhotoContainerNode = formNode.querySelector('.ad-form__photo-container');
  const adPhotoListFragment = document.createDocumentFragment();

  for (const file of files) {
    const fileName = file.name.toLowerCase();

    const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

    if (matches) {
      const imgContainerNode = document.createElement('div');
      imgContainerNode.classList.add('ad-form__photo');

      const imgNode = document.createElement('img');
      imgNode.src = URL.createObjectURL(file);
      imgNode.width = 70;
      imgNode.height = 70;

      imgContainerNode.append(imgNode);
      adPhotoListFragment.append(imgContainerNode);

    } else {
      showAlert('Выберите подходящюю картинку');
    }
  }

  for (const photoNode of adPhotoContainerNode.querySelectorAll('.ad-form__photo')) {
    photoNode.remove();
  }

  adPhotoContainerNode.append(adPhotoListFragment);
});


const showLoadSuccessMsg = () => {
  const messageTemplateFragment = document.querySelector('#success').content;
  const messageTemplate = messageTemplateFragment.querySelector('.success');

  const messageEl = messageTemplate.cloneNode(true);

  document.body.appendChild(messageEl);
  document.body.classList.add('modal-open');

  messageEl.addEventListener('click', () => {
    closeLoadSuccessMsg();
  });


  document.addEventListener('keydown', onLoadSuccessEscKeydown);
};

function closeLoadSuccessMsg() {
  if (document.querySelector('.success')) {
    document.querySelector('.success').remove();
    document.body.classList.remove('modal-open');

    document.removeEventListener('keydown', onLoadSuccessEscKeydown);
  }
}
function onLoadSuccessEscKeydown(evt) {
  if (isEscapeKey(evt)) {
    closeLoadSuccessMsg();
  }
}

const showLoadErrorMsg = () => {
  const messageTemplateFragment = document.querySelector('#error').content;
  const messageTemplate = messageTemplateFragment.querySelector('.error');

  const messageEl = messageTemplate.cloneNode(true);

  document.body.appendChild(messageEl);
  document.body.classList.add('modal-open');

  messageEl.addEventListener('click', () => {
    closeLoadErrorMsg();
  });
  messageEl.querySelector('.error__button').addEventListener('click', () => {
    closeLoadErrorMsg();
  });

  document.addEventListener('keydown', onLoadErrorEscKeydown);
};


function closeLoadErrorMsg() {
  if (document.querySelector('.error')) {
    document.querySelector('.error').remove();
    document.body.classList.remove('modal-open');

    document.removeEventListener('keydown', onLoadErrorEscKeydown);
  }
}

function onLoadErrorEscKeydown(evt) {
  if (isEscapeKey(evt)) {
    closeLoadErrorMsg();
  }
}

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = 'Публикую...';
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = 'Опубликовать';
};

const setAdFormSubmit = () => {
  formNode.addEventListener('submit', (evt) => {
    evt.preventDefault();


    const isValid = pristine.validate();
    console.log(isValid);
    if (isValid) {
      blockSubmitButton();
      // sendData(
      //   () => {
      //     showLoadSuccessMsg();
      //     unblockSubmitButton();
      //   },
      //   () => {
      //     showLoadErrorMsg();
      //     unblockSubmitButton();
      //   },
      //   new FormData(evt.target),
      // );
    } else {
      showAlert('Заполните форму!');
    }
  });
};

const setInputAddressValue = (coords)  => {
  addressInput.value = `${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)}`
}
export { adFormInit, setAdFormSubmit, setInputAddressValue};
