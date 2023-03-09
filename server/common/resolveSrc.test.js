const { resolveSrc } = require('./resolveSrc');
const path = require('path');

describe('resolveSrc', () => {
  it('returns root path when src is null', () => {
    const result = resolveSrc({ src: null, relative: 'relative/path', root: '/root/path' });
    expect(result).toBe('/root/path');
  });

  it('returns relative path when src is empty', () => {
    const result = resolveSrc({ src: '', relative: 'relative/path', root: '/root/path' });
    expect(result).toBe('/root/path/relative/path');
  });

  it('returns joined root path when src starts with "/"', () => {
    const result = resolveSrc({ src: '/file.js', relative: 'relative/path', root: '/root/path' });
    expect(result).toBe('/root/path/file.js');
  });

  it('returns resolved path when src contains "../" segments', () => {
    const result = resolveSrc({ src: '../file.js', relative: 'relative/path', root: '/root/path' });
    expect(result).toBe(path.resolve('/root/path/relative/file.js'));
  });

  it('throws error when resolved path is outside of root path', () => {
    expect(() => {
      resolveSrc({ src: '../../../file.js', relative: 'relative/path', root: '/root/path' });
    }).toThrow('Not allowed to resolve path outside of /root/path');
  });

  it('resolves path from relative when src does not start with  "/"', () => {
    const result = resolveSrc({ src: 'folder/file.js', relative: 'relative/path', root: '/root/path' });
    expect(result).toBe(path.resolve('/root/path/relative/path/folder/file.js'));
  });

  it('joins root path with relative path if relative path does not start with root', () => {
    const result = resolveSrc({ src: 'file.js', relative: 'relative/path', root: '/root/path' });
    expect(result).toBe(path.resolve('/root/path/relative/path/file.js'));
  });

  it('not join root path with relative path if relative path starts with root', () => {
    const result = resolveSrc({ src: 'file.js', relative: '/root/path/subdir/relative/path', root: '/root/path' });
    expect(result).toBe(path.resolve('/root/path/subdir/relative/path/file.js'));
  });
});
