(() => {
  let activeOpener = null;

  const closeModal = (dialog) => {
    if (!(dialog instanceof HTMLDialogElement) || !dialog.open) return;
    dialog.close();
  };

  document.addEventListener('click', (event) => {
    const opener = event.target.closest('[data-project-open]');
    if (opener) {
      const dialog = document.getElementById(opener.dataset.projectOpen);
      if (dialog instanceof HTMLDialogElement) {
        event.preventDefault();
        activeOpener = opener;
        dialog.showModal();
        document.documentElement.classList.add('has-project-modal');
        dialog.querySelector('[data-project-close]')?.focus();
      }
      return;
    }

    const closer = event.target.closest('[data-project-close]');
    if (closer) closeModal(closer.closest('dialog'));
  });

  document.querySelectorAll('.ls-project-modal').forEach((dialog) => {
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) closeModal(dialog);
    });

    dialog.addEventListener('close', () => {
      document.documentElement.classList.remove('has-project-modal');
      activeOpener?.focus();
      activeOpener = null;
    });
  });
})();
