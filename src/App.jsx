import { useState, useEffect, useRef } from 'react';
import { Camera, Download, FileText, Globe, Link2, Loader2, Maximize, Monitor, Smartphone, Tablet, Github, Twitter, Clipboard } from 'lucide-react';
import './index.css';

function App() {
  const urlInputRef = useRef(null);
  const [url, setUrl] = useState('');
  const [device, setDevice] = useState('Desktop'); // Desktop, Tablet, Mobile
  const [width, setWidth] = useState(1920);
  const [format, setFormat] = useState('PNG'); // PNG, JPG

  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [screenshotData, setScreenshotData] = useState(null);

  // Update width when device changes
  useEffect(() => {
    if (device === 'Desktop') setWidth(1920);
    else if (device === 'Tablet') setWidth(768);
    else if (device === 'Mobile') setWidth(375);
  }, [device]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrl(text);
      }
    } catch (err) {
      console.error('Failed to read clipboard: ', err);
    }
  };

  const handleCapture = async (e) => {
    e.preventDefault();
    if (!url) return;

    let targetUrl = url;
    if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
      targetUrl = 'https://' + targetUrl;
    }

    setStatus('loading');
    setScreenshotData(null);

    try {
      // Using Microlink API to capture full page screenshot
      let apiUrl = `https://api.microlink.io?url=${encodeURIComponent(targetUrl)}&screenshot=true&meta=false&fullPage=true`;

      if (format === 'JPG') {
        apiUrl += '&screenshot.type=jpeg';
      } else {
        apiUrl += '&screenshot.type=png';
      }

      const rawWidth = Number(width) || 10000;
      const targetWidth = Math.max(200, Math.min(10000, rawWidth));
      apiUrl += `&viewport.width=${targetWidth}`;
      if (device === 'Mobile') {
        apiUrl += '&viewport.isMobile=true';
      }

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to capture screenshot');

      const data = await response.json();

      if (data.status === 'success' && data.data?.screenshot?.url) {
        setScreenshotData({
          imageUrl: data.data.screenshot.url,
          targetUrl: targetUrl
        });
        setStatus('success');
      } else {
        throw new Error('Screenshot not available');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  const handleDownload = async () => {
    if (!screenshotData?.imageUrl) return;
    const timestamp = new Date().getTime();
    const fileExt = format === 'JPG' ? 'jpg' : 'png';
    const baseName = `screenshot-${timestamp}`;

    try {
      // Use a CORS proxy to bypass CDN CORS issues
      const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(screenshotData.imageUrl)}`;
      const response = await fetch(proxyUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${baseName}.${fileExt}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error('Failed to download image via proxy', err);
      // Fallback: open in new tab
      window.open(screenshotData.imageUrl, '_blank');
    }
  };

  const handleDownloadPDF = () => {
    if (!screenshotData?.imageUrl) return;
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow popups to export as PDF');
        return;
      }

      printWindow.document.write(`<!DOCTYPE html>
        <html>
          <head>
            <title>GetWeb Screenshot</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { background: #fff; }
              img { width: 100%; height: auto; display: block; }
              @page { margin: 0; size: auto; }
            </style>
          </head>
          <body><img id="ss" src="${screenshotData.imageUrl}" /></body>
        </html>`);
      printWindow.document.close();

      const img = printWindow.document.getElementById('ss');

      const triggerPrint = () => {
        setTimeout(() => {
          printWindow.print();
        }, 300);
      };

      if (img.complete) {
        triggerPrint();
      } else {
        img.onload = triggerPrint;
        img.onerror = () => {
          alert('Failed to load image for print.');
        };
      }
    } catch (err) {
      console.error('Failed to export PDF', err);
      alert('PDF export failed. Try downloading the image instead.');
    }
  };

  return (
    <div className="app">
      <header className="container">
        <div className="logo">
          <Camera size={28} color="var(--accent-color)" />
          <span>GetWeb Screenshot</span>
        </div>
      </header>

      <main className="container main-content">
        <h1>
          Capture Any <br />
          <span className="gradient-text">Website Instantly</span>
        </h1>
        <p className="subtitle">
          Take a full page screenshot of any website in seconds. Just paste a URL and capture the entire webpage. Free, fast, no extension needed.
        </p>

        <form onSubmit={handleCapture} className="settings-form">
          <div className="form-group">
            <label>Website URL</label>
            <div className="input-container">
              <div className="input-icon">
                <Globe size={20} />
              </div>
              <input
                ref={urlInputRef}
                type="text"
                className="url-input"
                placeholder="example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={status === 'loading'}
              />
              <button
                type="button"
                className="paste-btn"
                onClick={handlePaste}
                title="Paste from clipboard"
              >
                <Clipboard size={16} />
                <span>Paste</span>
              </button>
            </div>
          </div>

          <div className="form-group">
            <label>Device</label>
            <div className="segmented-control">
              {['Desktop', 'Tablet', 'Mobile'].map(d => (
                <button
                  type="button"
                  key={d}
                  className={`segment-btn ${device === d ? 'active' : ''}`}
                  onClick={() => setDevice(d)}
                >
                  {d === 'Desktop' && <Monitor size={16} />}
                  {d === 'Tablet' && <Tablet size={16} />}
                  {d === 'Mobile' && <Smartphone size={16} />}
                  <span>{d}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Width in px</label>
            <div className="input-container no-icon">
              <input
                type="number"
                className="url-input"
                value={width}
                min="200"
                max="10000"
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '') {
                    setWidth('');
                  } else {
                    const num = Number(val);
                    setWidth(num > 10000 ? 10000 : num);
                  }
                }}
                onBlur={() => {
                  const num = Number(width);
                  if (width === '' || isNaN(num)) {
                    setWidth(10000);
                  } else if (num < 200) {
                    setWidth(200);
                  } else if (num > 10000) {
                    setWidth(10000);
                  }
                }}
                onWheel={(e) => e.target.blur()}
                placeholder="10000"
                disabled={status === 'loading'}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Format</label>
            <div className="segmented-control">
              {['PNG', 'JPG'].map(f => (
                <button
                  type="button"
                  key={f}
                  className={`segment-btn ${format === f ? 'active' : ''}`}
                  onClick={() => setFormat(f)}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="capture-btn submit-btn"
            disabled={!url || status === 'loading'}
          >
            {status === 'loading' ? (
              <>
                <Loader2 size={18} className="spin" />
                Capturing...
              </>
            ) : (
              <>
                Capture <Maximize size={18} />
              </>
            )}
          </button>
        </form>

        {status === 'error' && (
          <p style={{ color: '#ff6b6b', marginTop: '16px' }}>
            Failed to capture screenshot. Please check the URL and try again.
          </p>
        )}

        {(status === 'loading' || status === 'success') && (
          <div className="result-container">
            <div className="browser-bar">
              <div className="browser-dot dot-red"></div>
              <div className="browser-dot dot-yellow"></div>
              <div className="browser-dot dot-green"></div>
              <div style={{ marginLeft: '12px', color: 'rgba(255,255,255,0.4)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Link2 size={12} />
                {screenshotData?.targetUrl || url}
              </div>
            </div>

            {status === 'loading' ? (
              <div className="skeleton-loader"></div>
            ) : (
              <img
                src={screenshotData.imageUrl}
                alt={`Screenshot of ${screenshotData.targetUrl}`}
                className="screenshot-image"
                loading="lazy"
              />
            )}
          </div>
        )}

        {status === 'success' && (
          <div className="actions">
            <button onClick={handleDownload} className="download-btn">
              <Download size={18} />
              Download Image
            </button>
            <button onClick={handleDownloadPDF} className="download-btn pdf-btn">
              <FileText size={18} />
              Download as PDF
            </button>
            <a href={screenshotData.imageUrl} target="_blank" rel="noreferrer" className="download-btn">
              <Maximize size={18} />
              View Full Size
            </a>
          </div>
        )}
      </main>

      <footer className="footer container">
        <div className="footer-content">
          <div className="footer-left">
            <a href="https://opensource.org/licenses/MIT" target="_blank" rel="noopener noreferrer" className="license-badge">
              MIT License
            </a>
          </div>
          <div className="footer-center">
            <span>Created by <a href="https://github.com/khxaiyan" target="_blank" rel="noopener noreferrer" className="author-name">Aiyan khan</a> &copy; {new Date().getFullYear()}</span>
          </div>
          <div className="footer-right">
            <a href="https://github.com/khxaiyan/GetWeb_Screenshot" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="social-link">
              <Github size={20} />
            </a>
            <a href="https://twitter.com/khxaiyan" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="social-link">
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </footer>

      {/* Floating Actions Group in Bottom-Right Corner */}
      <div className="floating-actions-group">
        {status === 'success' && (
          <>
            <button
              className="floating-btn download-img"
              onClick={handleDownload}
              title="Download Image & JSON"
              aria-label="Download Image"
            >
              <Download size={20} />
            </button>
            <button
              className="floating-btn download-pdf"
              onClick={handleDownloadPDF}
              title="Download as PDF"
              aria-label="Download as PDF"
            >
              <FileText size={20} />
            </button>
          </>
        )}
        <button
          className="floating-btn scroll-to-input"
          onClick={() => {
            urlInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
              urlInputRef.current?.focus();
            }, 500);
          }}
          title="Enter URL"
          aria-label="Scroll to URL Input"
        >
          <Globe size={20} />
        </button>
      </div>
    </div>
  );
}

export default App;
