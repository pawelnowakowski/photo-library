const picsumOrigin = 'https://picsum.photos';

if (!document.head.querySelector(`link[rel="preconnect"][href="${picsumOrigin}"]`)) {
  const preconnect = document.createElement('link');
  preconnect.rel = 'preconnect';
  preconnect.href = picsumOrigin;
  document.head.append(preconnect);
}
