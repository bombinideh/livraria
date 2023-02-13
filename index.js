function x() {
  null();
}

function y() {
  try {
    x();
  } catch {
    console.log(1);
  }
}

y();
