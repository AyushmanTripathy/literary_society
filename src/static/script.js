async function like(button, id) {
  const res = await fetch(`/posts/${id}/like`, {
    method: "POST",
  });

  if (!res.ok) return console.log(status);
  window.location.reload();
}

async function dislike(button, id) {
  const res = await fetch(`/posts/${id}/dislike`, {
    method: "POST",
  });

  if (!res.ok) return console.log(status);
  window.location.reload();
}
