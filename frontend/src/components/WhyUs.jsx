import { useEffect, useRef, useState } from "react";

const POINTS = [
  {
    id: "verified",
    tag: "Trust",
    title: "Only verified pharmacies",
    body: "Every pharmacy on our platform is government-registered and verified. No grey-market sellers, no counterfeit risk — your medicine is always the real thing.",
    stat: "100%", statLabel: "verified partners",
  },
  {
    id: "ai",
    tag: "Intelligence",
    title: "AI that speaks your language",
    body: "Ask about drug interactions, dosage, or side effects in plain English, Hindi, or your local language. Our AI gives safe, sourced answers — not generic web results.",
    stat: "24 / 7", statLabel: "AI assistance",
  },
  {
    id: "speed",
    tag: "Speed",
    title: "Medicine at your door in hours",
    body: "From prescription upload to doorstep delivery, the entire journey happens inside one app. Live tracking keeps you informed at every step — no calls, no guessing.",
    stat: "< 2 hrs", statLabel: "avg. delivery time",
  },
  {
    id: "reminders",
    tag: "Care",
    title: "Reminders that actually ring",
    body: "Our dose alarms cut through Do Not Disturb. One tap from the notification marks a dose Taken or Snoozed — no need to open the app at all.",
    stat: "0 missed", statLabel: "doses with reminders",
  },
  {
    id: "unified",
    tag: "Simplicity",
    title: "One app for everyone",
    body: "Most health apps solve one piece. We connect the entire chain — patient, pharmacy, and doctor — so care flows seamlessly without switching tools.",
    stat: "3-in-1", statLabel: "unified platform",
  },
];

/* ─────────────────────────────────────────────
   3-D capsule intro scene (Three.js via CDN)
   Mirrors the Premier "crystal" transition:
     • deep-black bg fades in as section enters
     • 3-D capsule rises from below, slowly rotates
     • large headline sits behind the capsule
     • capsule exits upward, content fades in
───────────────────────────────────────────── */
function CapsuleIntro({ progress }) {
  const mountRef = useRef(null);
  const threeRef = useRef(null);

  // progress 0→1 drives the scroll animation
  // 0.00–0.18 : capsule rises in
  // 0.18–0.72 : capsule floats + rotates
  // 0.72–1.00 : capsule exits upward

  useEffect(() => {
    let animId;
    let THREE, renderer, scene, camera, capsuleGroup;

    const W = () => mountRef.current?.clientWidth  || 400;
    const H = () => mountRef.current?.clientHeight || 560;

    async function init() {
      // Dynamically load Three.js from CDN
      if (!window.__THREE__) {
        await new Promise((res, rej) => {
          const s = document.createElement("script");
          s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
          s.onload = res; s.onerror = rej;
          document.head.appendChild(s);
        });
        window.__THREE__ = window.THREE;
      }
      THREE = window.__THREE__;
      if (!mountRef.current) return;

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W(), H());
      renderer.setClearColor(0x000000, 0);
      mountRef.current.appendChild(renderer.domElement);

      // Scene + camera
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(38, W() / H(), 0.1, 100);
      camera.position.set(0, 0, 5);

      // Lights — brand green key, mint fill, white rim
      const key  = new THREE.PointLight(0x00a152, 6, 14);
      key.position.set(2, 3, 3);
      const fill = new THREE.PointLight(0x6fe7a8, 3, 12);
      fill.position.set(-3, -1, 2);
      const rim  = new THREE.PointLight(0xffffff, 2, 10);
      rim.position.set(0, -4, -2);
      const ambient = new THREE.AmbientLight(0x0a1f12, 2);
      scene.add(key, fill, rim, ambient);

      // ── Capsule geometry: cylinder body + two sphere caps ──
      capsuleGroup = new THREE.Group();

      const mat = new THREE.MeshPhysicalMaterial({
        color: 0x00c060,
        metalness: 0.85,
        roughness: 0.08,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        reflectivity: 1,
        envMapIntensity: 1.4,
        emissive: 0x003318,
        emissiveIntensity: 0.18,
      });
      const matBot = new THREE.MeshPhysicalMaterial({
        color: 0xeafff4,
        metalness: 0.6,
        roughness: 0.12,
        clearcoat: 1.0,
        clearcoatRoughness: 0.06,
        reflectivity: 0.9,
        emissive: 0x6fe7a8,
        emissiveIntensity: 0.12,
      });

      const R = 0.42, bodyH = 1.0;

      // Body cylinder (top half uses green mat, bottom half white mat)
      // We split into two half-cylinders
      const bodyTop = new THREE.CylinderGeometry(R, R, bodyH / 2, 64, 1, true);
      const bodyBot = new THREE.CylinderGeometry(R, R, bodyH / 2, 64, 1, true);
      const meshBodyTop = new THREE.Mesh(bodyTop, mat);
      meshBodyTop.position.y = bodyH / 4;
      const meshBodyBot = new THREE.Mesh(bodyBot, matBot);
      meshBodyBot.position.y = -bodyH / 4;

      // Cap spheres
      const capGeo = new THREE.SphereGeometry(R, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2);
      const capTop = new THREE.Mesh(capGeo, mat);
      capTop.position.y = bodyH / 2;

      const capBotGeo = new THREE.SphereGeometry(R, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
      const capBot = new THREE.Mesh(capBotGeo, matBot);
      capBot.position.y = -bodyH / 2;

      // Equator ring — glowing seam
      const ringGeo = new THREE.TorusGeometry(R + 0.01, 0.025, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x6fe7a8 });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;

      capsuleGroup.add(meshBodyTop, meshBodyBot, capTop, capBot, ring);
      // Tilt like the Premier gem — slightly rotated for drama
      capsuleGroup.rotation.z = 0.35;
      capsuleGroup.rotation.x = 0.15;
      scene.add(capsuleGroup);

      threeRef.current = { THREE, renderer, scene, camera, capsuleGroup };

      // Handle resize
      const onResize = () => {
        if (!mountRef.current || !renderer) return;
        camera.aspect = W() / H();
        camera.updateProjectionMatrix();
        renderer.setSize(W(), H());
      };
      window.addEventListener("resize", onResize);

      // Animate
      const clock = new THREE.Clock();
      const tick = () => {
        animId = requestAnimationFrame(tick);
        const t = clock.getElapsedTime();
        // Gentle idle rotation
        if (capsuleGroup) {
          capsuleGroup.rotation.y = t * 0.55;
          capsuleGroup.rotation.x = 0.15 + Math.sin(t * 0.4) * 0.1;
        }
        renderer.render(scene, camera);
      };
      tick();

      threeRef.current._onResize = onResize;
    }

    init().catch(console.error);

    return () => {
      cancelAnimationFrame(animId);
      if (threeRef.current?._onResize) {
        window.removeEventListener("resize", threeRef.current._onResize);
      }
      if (threeRef.current?.renderer) {
        threeRef.current.renderer.dispose();
        threeRef.current.renderer.domElement?.remove();
      }
      threeRef.current = null;
    };
  }, []);

  // Drive capsule position from scroll progress
  useEffect(() => {
    const g = threeRef.current?.capsuleGroup;
    if (!g) return;

    let yPos, opacity, scale;
    if (progress < 0.15) {
      // Rising in from below
      const t = progress / 0.15;
      yPos    = -4 + t * 4;
      opacity = t;
      scale   = 0.7 + t * 0.3;
    } else if (progress < 0.75) {
      // Floating in centre
      const t = (progress - 0.15) / 0.60;
      yPos    = Math.sin(t * Math.PI * 0.5) * 0.3; // gentle bob
      opacity = 1;
      scale   = 1;
    } else {
      // Exiting upward
      const t = (progress - 0.75) / 0.25;
      yPos    = t * 5;
      opacity = 1 - t;
      scale   = 1 + t * 0.2;
    }

    g.position.y = yPos;
    g.scale.setScalar(scale);
    if (threeRef.current?.renderer?.domElement) {
      threeRef.current.renderer.domElement.style.opacity = opacity;
    }
  }, [progress]);

  return (
    <div className="whyus__intro-canvas" ref={mountRef} aria-hidden />
  );
}

/* ─────────────────────────────────────────────
   Desktop: sticky scroll experience
───────────────────────────────────────────── */
function DesktopWhyUs() {
  const sectionRef = useRef(null);
  const [scrollT, setScrollT] = useState(0); // 0→1 over entire section
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const onScroll = () => {
      const rect    = section.getBoundingClientRect();
      const sectionH = section.offsetHeight;
      const windowH  = window.innerHeight;
      const scrolled  = -rect.top;
      const total     = sectionH - windowH;
      if (total <= 0) return;

      const t = Math.max(0, Math.min(1, scrolled / total));
      setScrollT(t);

      // First 40% of scroll = intro; remaining 60% = steps
      if (t > 0.4) {
        const stepT = (t - 0.4) / 0.6;
        const idx = Math.min(POINTS.length - 1, Math.floor(stepT * POINTS.length));
        setActiveIdx(idx);
      } else {
        setActiveIdx(0);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const point  = POINTS[activeIdx];
  const pillY  = (activeIdx / (POINTS.length - 1)) * 100;

  // Intro visible for first 45% of scroll; content visible from 35% onward (overlap = crossfade)
  const introOpacity   = scrollT < 0.38 ? 1 : Math.max(0, 1 - (scrollT - 0.38) / 0.08);
  const contentOpacity = scrollT < 0.33 ? 0 : Math.min(1, (scrollT - 0.33) / 0.10);

  // Capsule progress maps 0→0.45 of scrollT to 0→1
  const capsuleProgress = Math.min(1, scrollT / 0.45);

  return (
    <div
      className="whyus"
      ref={sectionRef}
      id="why"
      style={{ "--steps": POINTS.length }}
    >
      <div className="whyus__sticky">

        {/* ── INTRO SCENE — capsule + big title ── */}
        <div className="whyus__intro" style={{ opacity: introOpacity, pointerEvents: introOpacity < 0.05 ? "none" : "auto" }}>
          <p className="whyus__intro-eyebrow eyebrow">Why choose us</p>
          <h2 className="whyus__intro-title">
            Not just another<br /><span className="grad">health app.</span>
          </h2>
          <CapsuleIntro progress={capsuleProgress} />
        </div>

        {/* ── MAIN CONTENT — fades in as capsule exits ── */}
        <div className="whyus__content-layer" style={{ opacity: contentOpacity, pointerEvents: contentOpacity < 0.05 ? "none" : "auto" }}>

          {/* LEFT */}
          <div className="whyus__left">
            <span className="eyebrow whyus__eyebrow">Why choose us</span>
            <h2 className="whyus__title">
              Not just another&nbsp;<span className="grad">health app.</span>
            </h2>
            <div className="whyus__content" key={activeIdx}>
              <span className="whyus__tag">{point.tag}</span>
              <h3 className="whyus__point-title">{point.title}</h3>
              <p className="whyus__point-body">{point.body}</p>
              <div className="whyus__stat">
                <span className="whyus__stat-num">{point.stat}</span>
                <span className="whyus__stat-label">{point.statLabel}</span>
              </div>
            </div>
            <div className="whyus__counter">
              <span className="whyus__counter-cur">{String(activeIdx + 1).padStart(2, "0")}</span>
              <span className="whyus__counter-sep">/</span>
              <span className="whyus__counter-total">{String(POINTS.length).padStart(2, "0")}</span>
            </div>
          </div>

          {/* CENTRE: capsule track */}
          <div className="whyus__track-wrap">
            <div className="whyus__track-line">
              <div className="whyus__track-fill" style={{ height: `${pillY}%` }} />
            </div>
            <div className="whyus__pill" style={{ top: `${pillY}%` }}>
              <div className="whyus__capsule">
                <div className="whyus__capsule-top" />
                <div className="whyus__capsule-bot" />
              </div>
              <span className="whyus__pill-ring" />
              <span className="whyus__pill-ring whyus__pill-ring--2" />
            </div>
            {POINTS.map((_, i) => (
              <div
                key={i}
                className={`whyus__dot ${i === activeIdx ? "is-active" : ""} ${i < activeIdx ? "is-done" : ""}`}
                style={{ top: `${(i / (POINTS.length - 1)) * 100}%` }}
              />
            ))}
          </div>

          {/* RIGHT: step list */}
          <div className="whyus__list">
            {POINTS.map((p, i) => (
              <div
                key={p.id}
                className={`whyus__item ${i === activeIdx ? "is-active" : ""} ${i < activeIdx ? "is-done" : ""}`}
              >
                <span className="whyus__item-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="whyus__item-title">{p.title}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Mobile / Tablet: stacked cards, no scroll-jack
   Capsule intro shown as a simpler CSS animation
───────────────────────────────────────────── */
function MobileWhyUs() {
  const introRef = useRef(null);
  const [introSeen, setIntroSeen] = useState(false);

  useEffect(() => {
    const el = introRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIntroSeen(true); },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div className="whyus whyus--mobile" id="why">

      {/* Mini intro banner */}
      <div className="whyus__mob-intro" ref={introRef}>
        <div className={`whyus__mob-capsule-wrap ${introSeen ? "is-visible" : ""}`}>
          {/* CSS-only 3D-ish capsule */}
          <div className="whyus__mob-capsule">
            <div className="whyus__mob-cap-top" />
            <div className="whyus__mob-cap-body" />
            <div className="whyus__mob-cap-bot" />
            <span className="whyus__mob-ring" />
            <span className="whyus__mob-ring whyus__mob-ring--2" />
            <span className="whyus__mob-ring whyus__mob-ring--3" />
          </div>
        </div>
        <div className={`whyus__mob-intro-text ${introSeen ? "is-visible" : ""}`}>
          <span className="eyebrow">Why choose us</span>
          <h2 className="whyus__title">
            Not just another <span className="grad">health app.</span>
          </h2>
        </div>
      </div>

      {/* Stacked cards */}
      <div className="whyus__mobile-list">
        {POINTS.map((p, i) => (
          <div className="whyus__mobile-card reveal-up" key={p.id} style={{ animationDelay: `${i * 80}ms` }}>
            <span className="whyus__tag">{p.tag}</span>
            <h4>{p.title}</h4>
            <p>{p.body}</p>
            <div className="whyus__stat">
              <span className="whyus__stat-num">{p.stat}</span>
              <span className="whyus__stat-label">{p.statLabel}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export function WhyUs() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(max-width: 940px)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 940px)");
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMobile ? <MobileWhyUs /> : <DesktopWhyUs />;
}
