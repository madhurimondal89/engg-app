import React, { useEffect, useRef } from 'react';

export default function GoogleAd() {
    const adRef = useRef<HTMLModElement>(null);
    const initialized = useRef(false);

    useEffect(() => {
        // We only want to push to adsbygoogle once per component mount
        if (!initialized.current && adRef.current && typeof window !== 'undefined') {
            try {
                initialized.current = true;
                setTimeout(() => {
                    ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
                }, 300); // Slight delay helps ensure script is loaded and DOM is ready
            } catch (e) {
                console.error("AdSense error", e);
            }
        }
    }, []);

    // Make sure not to render in development perfectly if it triggers errors, but usually it's fine.
    return (
        <div className="w-full flex justify-center my-4 overflow-hidden min-h-[90px]">
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ display: 'block', width: '100%' }}
                data-ad-client="ca-pub-8732458645979427"
                data-ad-slot="2981133239"
                data-ad-format="auto"
                data-full-width-responsive="true"
            />
        </div>
    );
}
