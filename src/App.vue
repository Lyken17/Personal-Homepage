<script setup>
import { onMounted, nextTick } from 'vue'
import SiteHeader from './components/SiteHeader.vue'
import RichText from './components/RichText.vue'
import ResourceLinks from './components/ResourceLinks.vue'
import PublicationItem from './components/PublicationItem.vue'
import ProjectCard from './components/ProjectCard.vue'
import site from './data/site.json'
import publications from './data/publications.yaml'

const selectedPublications = publications.filter(publication => publication.tag.includes('selected'))

const updatedLabel = new Intl.DateTimeFormat('en-US', {
  month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC',
}).format(new Date(`${site.profile.updated}T00:00:00Z`))

// The static page supported #publications links. Vue mounts after the initial
// document navigation, so restore that anchor once the sections are rendered.
onMounted(async () => {
  await nextTick()
  if (window.location.hash) {
    const id = decodeURIComponent(window.location.hash.slice(1))
    const target = document.getElementById(id)
    if (target) target.scrollIntoView()
    else if (publications.some(publication => publication.id === id)) {
      window.location.replace(`full-publications.html#${encodeURIComponent(id)}`)
    }
  }
})
</script>

<template>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <SiteHeader />

  <main id="main-content" class="container" tabindex="-1">
    <section id="about" class="hero" aria-labelledby="about-title">
      <figure class="portrait">
        <img :src="site.profile.image" alt="A sunflower wearing sunglasses — Ligeng Zhu's profile photo" width="240" height="240" fetchpriority="high" />
      </figure>
      <div class="hero-intro">
        <h1 id="about-title">{{ site.profile.name }}</h1>
        <p class="email-display">{{ site.profile.emailDisplay }}</p>
        <p class="email-note">{{ site.profile.emailNote }}</p>
      </div>
      <div class="hero-copy">
        <p v-for="(paragraph, index) in site.profile.biography" :key="index"><RichText :content="paragraph" /></p>
        <ResourceLinks :links="site.profile.links" />
        <p class="updated">Latest update on <time :datetime="site.profile.updated">{{ updatedLabel }}</time>.</p>
      </div>
    </section>

    <section id="news" class="content-section" aria-labelledby="news-title">
      <h2 id="news-title">News</h2>
      <ul class="news-list">
        <li v-for="(item, index) in site.news" :key="index">
          <time class="news-date" :datetime="item.date">[{{ item.date }}]</time>{{ ' ' }}<RichText :content="item.content" />
        </li>
      </ul>
    </section>

    <section id="publications" class="content-section" aria-labelledby="publications-title">
      <div class="section-heading">
        <h2 id="publications-title">Selected Publications</h2>
        <a href="full-publications.html">Full Publications <span aria-hidden="true">→</span></a>
      </div>
      <div class="publication-list">
        <PublicationItem v-for="publication in selectedPublications" :key="publication.id" :publication="publication" />
      </div>
    </section>

    <section id="collaborators" class="content-section" aria-labelledby="collaborators-title">
      <h2 id="collaborators-title">Students Collaborated with</h2>
      <ul class="collaborator-list">
        <li v-for="person in site.collaborators" :key="person.name">
          <a :href="person.href">{{ person.name }}</a>
          <span>{{ person.description }}</span>
        </li>
      </ul>
    </section>

    <section id="talks" class="content-section" aria-labelledby="talks-title">
      <h2 id="talks-title">Talks &amp; Presentations</h2>
      <ul class="talk-list">
        <li v-for="(talk, index) in site.talks" :key="index">
          <span class="talk-date">{{ talk.date }}</span>
          <p><RichText :content="talk.content" /></p>
        </li>
      </ul>
    </section>

    <section id="projects" class="content-section" aria-labelledby="projects-title">
      <h2 id="projects-title">Open-source Projects (Selected)</h2>
      <p class="section-intro">My life (both academic and daily) is greatly powered by open source projects. To thank their selfless effort, I embrace open source as much as possible. Please refer to <a href="https://github.com/Lyken17">my github</a> for a complete list of projects.</p>
      <div class="project-grid">
        <ProjectCard v-for="project in site.projects" :key="project.repo" :project="project" />
      </div>
    </section>

    <section id="services" class="content-section" aria-labelledby="services-title">
      <h2 id="services-title">Services</h2>
      <p class="section-intro">Review papers for:</p>
      <dl class="service-list">
        <div v-for="service in site.services" :key="service.label">
          <dt>{{ service.label }}</dt>
          <dd>{{ service.description }}</dd>
        </div>
      </dl>
    </section>
  </main>

  <footer class="container site-footer"><p><RichText :content="site.footer" /></p><a class="back-to-top" href="#about">Back to top ↑</a></footer>
</template>
