import { projects } from './projects.js';

document.documentElement.classList.add('js');

const projectGrid = document.querySelector('.project-grid');

const createProjectCard = (project, index) => {
	const card = document.createElement('article');
	card.className = `project-card reveal reveal-delay-${index + 1}`;

	const thumbnail = document.createElement('div');
	thumbnail.className = 'project-thumb';

	const image = document.createElement('img');
	image.src = project.image;
	image.alt = project.imageAlt;

	const number = document.createElement('span');
	number.className = 'project-number';
	number.textContent = String(index + 1).padStart(2, '0');
	thumbnail.append(image, number);

	const body = document.createElement('div');
	body.className = 'project-body';

	const copy = document.createElement('div');
	copy.className = 'project-copy';

	const category = document.createElement('div');
	category.className = 'meta';
	category.textContent = project.category;

	const title = document.createElement('h3');
	title.textContent = project.title;

	const description = document.createElement('p');
	description.textContent = project.description;
	copy.append(category, title, description);

	const tags = document.createElement('ul');
	tags.className = 'tag-list';
	project.tags.forEach((tag) => {
		const tagItem = document.createElement('li');
		tagItem.textContent = tag;
		tags.append(tagItem);
	});

	const projectLinks = document.createElement('div');
	projectLinks.className = 'project-links';

	const addProjectLink = (url, label) => {
		if (!url) {
			return;
		}

		const link = document.createElement('a');
		link.href = url;
		link.target = '_blank';
		link.rel = 'noreferrer';
		link.textContent = label;
		projectLinks.append(link);
	};

	addProjectLink(project.github, 'GitHub');
	addProjectLink(project.liveDemo, 'Live demo');

	body.append(copy, tags, projectLinks);
	card.append(thumbnail, body);
	return card;
};

projectGrid?.replaceChildren(...projects.map(createProjectCard));

const splashScreen = document.querySelector('#splash-screen');

splashScreen?.addEventListener('animationend', (event) => {
	if (event.animationName === 'splash-display') {
		splashScreen.remove();
	}
}, { once: true });

const revealItems = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const time_delay = 1900;

const showRevealItems = () => {
	revealItems.forEach((item) => item.classList.add('is-visible'));
	};

const startCodeTyping = () => {
	const codeElement = document.querySelector('.code-block code');

	if (!codeElement || codeElement.dataset.typingStarted === 'true') {
		return;
	}

	codeElement.dataset.typingStarted = 'true';
	codeElement.setAttribute('aria-label', codeElement.textContent.trim());
	const textNodes = [];
	const nodeWalker = document.createTreeWalker(codeElement, NodeFilter.SHOW_TEXT);
	let currentNode;

	while ((currentNode = nodeWalker.nextNode())) {
		textNodes.push({ node: currentNode, text: currentNode.textContent });
		currentNode.textContent = '';
	}

	codeElement.classList.add('is-typing');
	let nodeIndex = 0;
	let characterIndex = 0;

	const typeNextCharacter = () => {
		if (nodeIndex >= textNodes.length) {
			codeElement.classList.remove('is-typing');
			return;
		}

		const currentTextNode = textNodes[nodeIndex];
		currentTextNode.node.textContent += currentTextNode.text[characterIndex];
		characterIndex += 1;

		if (characterIndex >= currentTextNode.text.length) {
			nodeIndex += 1;
			characterIndex = 0;
		}

		window.setTimeout(typeNextCharacter, 18);
	};

	typeNextCharacter();
};

const startRevealObserver = () => {
	const revealObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (!entry.isIntersecting) {
				return;
			}

			entry.target.classList.add('is-visible');
			if (entry.target.classList.contains('main-panel')) {
				startCodeTyping();
			}
			observer.unobserve(entry.target);
		});
	}, {
		rootMargin: '0px 0px -10% 0px',
		threshold: 0.12,
	});

	revealItems.forEach((item) => revealObserver.observe(item));
};

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
	showRevealItems();
} else {
	window.addEventListener('load', () => {
		window.setTimeout(startRevealObserver, time_delay);
	}, { once: true });
}

if (!prefersReducedMotion) {
	const heroElements = [
		['.hero .banner-img', -0.08],
		['.hero .banner-img1', 0.06],
		['.hero .banner-text.down', 0.06],
		['.hero .label-fs', -0.04],
		['.hero .label-dev', 0.05],
		['.hero .label-dev2', 0.05],
	];
	let ticking = false;

	const updateHeroMotion = () => {
		const scrollOffset = Math.min(window.scrollY, window.innerHeight);

		heroElements.forEach(([selector, speed]) => {
			const element = document.querySelector(selector);
			if (element) {
				element.style.translate = `0 ${scrollOffset * speed}px`;
			}
		});

		ticking = false;
	};

	window.addEventListener('scroll', () => {
		if (!ticking) {
			window.requestAnimationFrame(updateHeroMotion);
			ticking = true;
		}
	}, { passive: true });
}
