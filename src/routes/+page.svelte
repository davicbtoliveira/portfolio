<script lang="ts">
  import { onMount } from "svelte";
  import PageHead from "../lib/PageHead.svelte";

  type Lang = "pt" | "en";
  type SocialKey = "github" | "linkedin" | "contato";
  type Message = { kind: "received" | "sent"; text: string; link?: string; detail?: string };

  const name = "Davi Oliveira";
  const description = "Crio software minimalista, com atenção aos detalhes.";
  const descriptionEn = "I build minimalist software, with attention to detail.";
  const socials: Array<{ key: SocialKey; label: string; url: string; domain: string }> = [
    { key: "github", label: "github", url: "https://github.com/davicbtoliveira", domain: "github.com/davicbtoliveira" },
    { key: "linkedin", label: "linkedin", url: "https://linkedin.com/in/dcbto", domain: "linkedin.com/in/dcbto" },
    { key: "contato", label: "contato", url: "mailto:davicbtoliveira@gmail.com", domain: "davicbtoliveira@gmail.com" },
  ];
  const socialCopy: Record<Lang, Record<SocialKey, { title: string; copy: string }>> = {
    pt: {
      github: { title: "GitHub · Davi Oliveira", copy: "Projetos, experimentos e código aberto." },
      linkedin: { title: "LinkedIn · Davi Oliveira", copy: "Experiência, trajetória e formas de trabalhar junto." },
      contato: { title: "davicbtoliveira@gmail.com", copy: "Envie uma mensagem por e-mail." },
    },
    en: {
      github: { title: "GitHub · Davi Oliveira", copy: "Projects, experiments and open source." },
      linkedin: { title: "LinkedIn · Davi Oliveira", copy: "Experience, background and ways to work together." },
      contato: { title: "davicbtoliveira@gmail.com", copy: "Send me an email." },
    },
  };

  let lang = $state<Lang>("pt");
  let selected = $state(new Set<SocialKey>());
  let messages = $state<Message[]>([
    { kind: "received", text: "Olá." },
    { kind: "received", text: `Eu sou ${name}. ${description}` },
  ]);

  let isEnglish = $derived(lang === "en");
  let currentDescription = $derived(isEnglish ? descriptionEn : description);
  let labels = $derived(isEnglish
    ? { available: "(Available)", says: "Davi says:", you: "You say:", hello: "Hello.", intro: `I'm ${name}. ${descriptionEn}`, choose: "Choose where to continue:", here: "Here it is:", status: "© Davi Oliveira. No rights reserved.", lang: "EN" }
    : { available: "(Disponível)", says: "Davi diz:", you: "Você diz:", hello: "Olá.", intro: `Eu sou ${name}. ${description}`, choose: "Escolha onde continuar:", here: "Aqui está:", status: "© Davi Oliveira. Nenhum direito reservado.", lang: "PT" });

  onMount(() => {
    lang = window.localStorage.getItem("lang") === "en" ? "en" : "pt";
    document.documentElement.lang = isEnglish ? "en" : "pt-BR";
    document.title = isEnglish ? `${name} — minimalist software` : `${name} — software minimalista`;
  });

  function chooseSocial(social: (typeof socials)[number]) {
    if (selected.has(social.key)) return;
    selected = new Set([...selected, social.key]);
    const localized = socialCopy[lang][social.key];
    messages = [
      ...messages,
      { kind: "sent", text: social.label },
      { kind: "received", text: `${labels.here} ${localized.title}`, link: social.url, detail: `${localized.copy} — ${social.domain}` },
    ];
  }

  function toggleLanguage() {
    lang = lang === "pt" ? "en" : "pt";
    window.localStorage.setItem("lang", lang);
    document.documentElement.lang = lang === "en" ? "en" : "pt-BR";
    document.title = lang === "en" ? `${name} — minimalist software` : `${name} — software minimalista`;
  }
</script>

<PageHead
  title="Davi Oliveira — software minimalista"
  description="Davi Oliveira — Crio software minimalista, com atenção aos detalhes."
  canonicalPath="/"
  faviconPath="/msn-messenger.svg"
 />

<div class="messenger-page">
  <section class="messenger-window" aria-label={`Conversa com ${name}`} data-msn-chat>
    <header class="window-titlebar">
      <img class="msn-icon" src="/msn-messenger.svg" alt="" aria-hidden="true" data-messenger-icon />
      <p>{name} — Conversa</p>
      <div class="window-controls" aria-hidden="true"><i></i><i></i><i></i></div>
    </header>

    <div class="messenger-surface">
      <div class="messenger-toolbar" aria-hidden="true">
        <span>Fotos</span><span>Arquivos</span><span>Vídeo</span><span>Ligar</span><span>Jogos</span><span>Atividades</span><span>»</span>
      </div>

      <div class="contact-bar">
        <div class="avatar avatar--contact" aria-hidden="true">DO</div>
        <div>
          <h1>{name} <span>{labels.available}</span></h1>
          <p>{currentDescription}</p>
        </div>
      </div>

      <div class="chat-workspace">
        <aside class="profile-rail" aria-hidden="true">
          <span class="rail-handle">‹</span>
          <div class="avatar avatar--self"><span></span></div>
        </aside>

        <div class="chat-column">
          <div class="conversation" data-messages aria-live="polite">
            <p class="conversation-note">{isEnglish ? "Use the links below to find me." : "Use os links abaixo para me encontrar."}</p>
            {#each messages as message, index (`${message.kind}-${index}-${message.text}`)}
              <article class={["message", message.kind === "sent" && "message--sent", message.kind === "received" && "message--received"]}>
                <p class="message-meta">{message.kind === "sent" ? labels.you : labels.says}</p>
                {#if message.link}
                  <p class="message-line">{labels.here} <a class="message-link" href={message.link} target="_blank" rel="noreferrer">{message.text}</a></p>
                  <p class="message-detail">{message.detail}</p>
                {:else}
                  <p class="message-line">{message.text}</p>
                {/if}
              </article>
            {/each}
          </div>

          <div class="choice-panel">
            <div class="composer-field">
              <p>{labels.choose}</p>
              <div class="choices" aria-label="Links de Davi">
                {#each socials as social (social.key)}
                  <button
                    type="button"
                    data-social-choice
                    data-social={social.key}
                    data-label={social.label}
                    data-url={social.url}
                    data-domain={social.domain}
                    data-title={socialCopy[lang][social.key].title}
                    data-copy={socialCopy[lang][social.key].copy}
                    disabled={selected.has(social.key)}
                    onclick={() => chooseSocial(social)}
                  >
                    <svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true">
                      {#if social.key === "github"}
                        <path fill="currentColor" d="M12 .7a11.3 11.3 0 0 0-3.57 22.02c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.5-1.3-1.26-1.64-1.26-1.64-1.04-.7.08-.68.08-.68 1.15.08 1.75 1.17 1.75 1.17 1.02 1.75 2.68 1.25 3.33.96.1-.74.4-1.25.72-1.54-2.5-.28-5.13-1.25-5.13-5.57 0-1.23.44-2.23 1.16-3.02-.12-.28-.5-1.44.11-3 0 0 .95-.3 3.1 1.16A10.8 10.8 0 0 1 12 6.2c.96 0 1.93.13 2.83.38 2.16-1.46 3.1-1.16 3.1-1.16.62 1.56.23 2.72.12 3 .72.8 1.16 1.8 1.16 3.02 0 4.33-2.64 5.28-5.15 5.56.4.35.76 1.03.76 2.08v3.08c0 .3.2.65.78.54A11.3 11.3 0 0 0 12 .7Z" />
                      {:else if social.key === "linkedin"}
                        <path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V8.98h3.42v1.57h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.46v6.29ZM5.34 7.42a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.03H3.56V8.98h3.56v11.47Z" />
                      {:else}
                        <path fill="currentColor" d="M3 5h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm9 7.2L20.1 7H3.9L12 12.2Zm0 2.4L3 8.8V17h18V8.8l-9 5.8Z" />
                      {/if}
                    </svg>
                    <span>{social.key === "contato" && isEnglish ? "contact" : social.label}</span>
                  </button>
                {/each}
              </div>
            </div>
            <div class="composer-toolbar" aria-hidden="true"><span>☺</span><span class="composer-font">A</span><span>▧</span><span>♫</span></div>
          </div>
        </div>
      </div>

      <footer class="messenger-statusbar"><span>Windows Live Messenger</span><span>{labels.status}</span></footer>
    </div>
  </section>

  <div class="win7-taskbar" aria-hidden="true">
    <span class="start-orb" aria-label="Iniciar"><img src="/win7-orb.png" alt="" /></span>
    <span class="taskbar-app"><img class="taskbar-app__icon" src="/msn-messenger.svg" alt="" /><span>{name}</span></span>
    <button type="button" class="taskbar-tray" data-lang-toggle aria-label="Alternar idioma" onclick={toggleLanguage}>{labels.lang}</button>
  </div>
</div>

<style>
  :global(body) { background: #b7d7e8; }
  .messenger-page { --ink: #243b4a; --line: #a9cedc; position: relative; isolation: isolate; min-height: 100vh; box-sizing: border-box; display: grid; place-items: center; overflow: hidden; padding: 3rem 1rem 4.5rem; background: radial-gradient(ellipse at 56% 48%, rgb(232 251 255 / 68%) 0 8%, transparent 40%), radial-gradient(ellipse at 47% 110%, #7dbbdf 0 15%, transparent 46%), linear-gradient(145deg, #174e87 0%, #2f8ac3 38%, #9ad9ef 70%, #2e74a6 100%); color: var(--ink); font-family: "Segoe UI", Tahoma, Arial, sans-serif; }
  .messenger-window { z-index: 1; width: min(100%, 44rem); height: min(41rem, calc(100vh - 7.5rem)); min-height: 34rem; box-sizing: border-box; display: flex; flex-direction: column; overflow: hidden; padding: 0 0.38rem 0.38rem; border: 1px solid #285f7f; border-radius: 8px 8px 5px 5px; background: linear-gradient(90deg, rgb(227 248 255 / 84%), rgb(92 185 222 / 72%) 45%, rgb(204 242 253 / 84%)), #72beda; box-shadow: 0 0 0 1px rgb(239 252 255 / 82%) inset, 0 0 0 2px rgb(30 79 108 / 36%), 0 22px 55px rgb(5 28 51 / 55%); }
  .window-titlebar { height: 1.9rem; display: flex; flex-shrink: 0; align-items: center; gap: 0.35rem; padding-left: 0.08rem; color: #152d3a; }
  .window-titlebar p { flex: 1; margin: 0; font-size: 0.75rem; font-weight: 600; text-shadow: 0 1px white, 0 0 5px white; }
  .msn-icon { width: 1.1rem; height: 1rem; flex: 0 0 auto; }
  .window-controls { height: 1.34rem; display: flex; align-self: flex-start; margin-right: -0.38rem; overflow: hidden; border-radius: 0 0 5px 5px; }
  .window-controls i { position: relative; display: grid; width: 1.85rem; box-sizing: border-box; place-items: center; border: 0; border-bottom: 1px solid #4e839d; border-left: 1px solid rgb(52 104 132 / 55%); background: linear-gradient(#eefaff 0%, #b8ddec 46%, #78b6d0 100%); }
  .window-controls i::after { content: "—"; }
  .window-controls i:nth-child(2)::after { content: "□"; }
  .window-controls i:last-child { width: 2.85rem; border-color: #8f3732; border-radius: 0 0 5px; background: linear-gradient(#f7c2bd 0%, #df746c 45%, #b43d38 100%); color: white; }
  .window-controls i:last-child::after { content: "×"; }
  .messenger-surface { min-height: 0; flex: 1; display: flex; flex-direction: column; overflow: hidden; border: 1px solid #416f85; background: white; }
  .messenger-toolbar { min-height: 2rem; box-sizing: border-box; display: flex; align-items: center; gap: 1rem; overflow: hidden; padding: 0 0.75rem; border-bottom: 1px solid #158eb8; background: linear-gradient(#6fd2ed 0%, #37b9e0 46%, #199bc9 100%); color: white; font-size: 0.72rem; white-space: nowrap; }
  .contact-bar { min-height: 6.8rem; box-sizing: border-box; display: grid; grid-template-columns: 7.1rem minmax(0, 1fr); flex-shrink: 0; align-items: center; padding: 0.55rem 1rem 0.55rem 0.7rem; border-bottom: 1px solid #bbdce8; background: radial-gradient(ellipse at 62% 15%, #eafaff 0%, #bce9f5 38%, #7fd1e8 100%); }
  .avatar { display: grid; place-items: center; box-sizing: border-box; color: #eef8ff; font-weight: 600; background: linear-gradient(145deg, #b8deea 0%, #638da3 55%, #31566a 100%); }
  .avatar--contact { width: 5.65rem; height: 5.65rem; border: 3px solid #79d329; border-radius: 7px; font-size: 1.05rem; box-shadow: 0 0 0 1px #3d6e80, 0 0 0 3px white, 0 4px 9px rgb(31 105 84 / 30%); }
  .contact-bar h1 { margin: 0; color: #294251; font-size: 1.08rem; font-weight: 400; line-height: 1.2; text-shadow: 0 1px white; }
  .contact-bar h1 span { font-size: 0.72rem; }
  .contact-bar p { margin: 0.22rem 0 0; color: #425c69; font-size: 0.76rem; }
  .chat-workspace { min-height: 0; flex: 1; display: grid; grid-template-columns: 7.1rem minmax(0, 1fr); background: #f8fcfe; }
  .profile-rail { position: relative; border-right: 1px solid #bddce7; background: linear-gradient(90deg, #eaf7fb, #f8fdff 82%, #d9edf4); }
  .rail-handle { position: absolute; top: 0.45rem; left: 0.36rem; width: 0.84rem; height: 0.84rem; display: grid; place-items: center; border: 1px solid #78a3b4; border-radius: 50%; background: linear-gradient(white, #cae5ef); color: #3e7489; }
  .avatar--self { position: absolute; right: 0.72rem; bottom: 0.95rem; width: 5rem; height: 5rem; border: 2px solid #81cc46; border-radius: 6px; background: linear-gradient(#f7fcfd, #b8d0d8); }
  .avatar--self span::before, .avatar--self span::after { position: absolute; left: 50%; background: linear-gradient(#f2f5f6, #9babb1); box-shadow: 0 0 0 1px #87999f; content: ""; transform: translateX(-50%); }
  .avatar--self span::before { top: 0.78rem; width: 1.42rem; height: 1.42rem; border-radius: 50%; }
  .avatar--self span::after { bottom: 0.68rem; width: 2.9rem; height: 1.8rem; border-radius: 50% 50% 30% 30%; }
  .chat-column { min-width: 0; min-height: 0; display: flex; flex-direction: column; background: white; }
  .conversation { min-height: 8rem; flex: 1; overflow-y: auto; padding: 0.8rem 0.9rem 1rem; background: linear-gradient(#fff, #fff 78%, #f8fcfe); font-family: Tahoma, "Segoe UI", Arial, sans-serif; }
  .conversation-note { margin: 0 0 0.95rem; padding-bottom: 0.45rem; border-bottom: 1px solid #cadde4; color: #6b7d85; font-size: 0.7rem; }
  .message { margin-top: 0.55rem; }
  .message:first-of-type { margin-top: 0; }
  .message-meta { margin: 0; color: #65747b; font-size: 0.74rem; }
  .message-line { margin: 0.1rem 0 0; color: #263b46; font-size: 0.78rem; line-height: 1.4; }
  .message--sent .message-meta { color: #397491; }
  .message-detail { margin: 0.1rem 0 0; color: #73828a; font-size: 0.68rem; }
  .message-link { color: #0066cc; text-decoration: underline; }
  .choice-panel { flex: 0 0 auto; padding: 0.35rem 0.5rem 0.42rem; border-top: 1px solid var(--line); background: #eef8fb; }
  .composer-field { min-height: 5rem; box-sizing: border-box; padding: 0.5rem 0.55rem; border: 1px solid #9fc4d2; border-radius: 2px; background: white; }
  .choice-panel p { margin: 0 0 0.45rem; color: #577482; font-size: 0.7rem; }
  .choices { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .choices button { display: inline-flex; align-items: center; gap: 0.32rem; padding: 0.32rem 0.6rem; border: 1px solid #759fbd; border-radius: 3px; background: linear-gradient(#fff 0%, #edf7fc 48%, #cfe8f3 100%); color: #235a84; cursor: pointer; font: 600 0.72rem "Segoe UI", Tahoma, sans-serif; }
  .choices button:disabled { cursor: default; opacity: 0.5; }
  .social-icon { width: 0.85rem; height: 0.85rem; flex: 0 0 auto; color: #1d7fc2; }
  .composer-toolbar { height: 1.7rem; display: flex; align-items: center; gap: 0.72rem; padding: 0 0.25rem; color: #357b9c; font-size: 0.88rem; }
  .composer-font { color: #1666a5; font: 700 0.78rem Georgia, serif; text-decoration: underline; }
  .messenger-statusbar { min-height: 1.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0 0.65rem; border-top: 1px solid #b7d6e1; background: linear-gradient(#f3fbfd, #d7eef4); color: #567584; font-size: 0.64rem; }
  .win7-taskbar { position: absolute; z-index: 2; right: 0; bottom: 0; left: 0; height: 2.8rem; box-sizing: border-box; display: flex; align-items: center; gap: 0.45rem; padding: 0 0.75rem; border-top: 1px solid rgb(221 248 255 / 82%); background: linear-gradient(rgb(79 141 177 / 78%), rgb(21 74 112 / 86%)); }
  .start-orb { position: relative; width: 3.25rem; height: 2.8rem; flex: 0 0 auto; }
  .start-orb img { position: absolute; top: -0.3rem; left: 0.15rem; width: 3rem; height: 3rem; display: block; }
  .taskbar-app { width: 10rem; height: 2.1rem; box-sizing: border-box; display: flex; align-items: center; gap: 0.45rem; padding: 0 0.62rem; border: 1px solid rgb(13 55 82 / 75%); border-radius: 3px; background: rgb(41 111 151 / 62%); color: white; font-size: 0.7rem; }
  .taskbar-app__icon { width: 1.45rem; height: 1.3rem; flex: 0 0 auto; }
  .taskbar-tray { margin-left: auto; color: white; font-size: 0.67rem; border: 0; background: transparent; cursor: pointer; font: inherit; padding: 0; }
  @media (max-width: 38rem) {
    .messenger-page { min-height: 100dvh; padding: 0; place-items: start stretch; overflow: visible; }
    .messenger-window { width: 100%; height: 100dvh; min-height: 34rem; padding: 0; border: 0; border-radius: 0; }
    .win7-taskbar { display: none; }
    .contact-bar, .chat-workspace { grid-template-columns: 5.45rem minmax(0, 1fr); }
    .contact-bar { min-height: 5.5rem; padding: 0.45rem 0.7rem 0.45rem 0.55rem; }
    .avatar--contact { width: 4.4rem; height: 4.4rem; }
    .avatar--self { right: 0.55rem; width: 4rem; height: 4rem; }
    .avatar--self span::before { top: 0.62rem; width: 1.15rem; height: 1.15rem; }
    .avatar--self span::after { bottom: 0.55rem; width: 2.35rem; height: 1.45rem; }
  }
  @media (prefers-reduced-motion: reduce) { .choices button { transition: none; } }
</style>
