// ==UserScript==
// @name         HDRezka Video Downloader
// @version      1.0.0.1
// @description  Remastered 'HDrezka Helper 4.2.0.1' by 'Super Zombi', video downloader only. Adds a 'Download' (green) button below the video
// @author       Dmytro Kazankov
// @match        https://hdrezka.cm/*
// @match        https://rezka.ag/*
// @match        https://hdrezka.me/*
// @match        https://hdrezka.ag/*
// @match        https://hdrezka.co/*
// @iconURL      https://rezka.cc/assets/images/favicon.ico
// @homepageURL  https://github.com/dkazankov/scripts
// @supportURL   https://github.com/dkazankov/scripts/issues
// @updateURL    https://raw.githubusercontent.com/dkazankov/scripts/main/hdrezka_downloader.user.js
// @downloadURL  https://raw.githubusercontent.com/dkazankov/scripts/main/hdrezka_downloader.user.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @resource     downloadButtonIcon https://icons.getbootstrap.com/assets/icons/download.svg
// @resource     closeButtonIcon https://icons.getbootstrap.com/assets/icons/x-square.svg
// @resource     saveButtonIcon https://icons.getbootstrap.com/assets/icons/floppy.svg
// @resource     resetButtonIcon https://icons.getbootstrap.com/assets/icons/arrow-counterclockwise.svg
// ==/UserScript==

(() => {
	'use strict'

	const resourceTexts = {
		'en': {
			"settings": "Settings",
			"saveButton": "Save",
			"resetButton": "Reset",
			"closeButton": "Close",
			"downloadStr": "Download",
			"downloadLinkDesc": "Alt click on the link to save the file",
			"cancelDownload": "Cancel",
			"fileNamePattern": "File name pattern",
			"insertVariable": "Insert Variable",
			"help": "Help",
			"movieTitle": "Movie title",
			"season": "Season",
			"episode": "Episode",
			"translation": "Translation",
			"resolution": "Resolution"
		},
		'ru': {
			"settings": "Настройки",
			"saveButton": "Сохранить",
			"resetButton": "Сбросить",
			"closeButton": "Закрыть",
			"downloadStr": "Скачать",
			"downloadLinkDesc": "Нажмите на ссылку, удерживая клавишу Alt, чтобы сохранить файл",
			"cancelDownload": "Отменить",
			"fileNamePattern": "Шаблон имени файла",
			"insertVariable": "Вставить переменную",
			"help": "Помощь",
			"movieTitle": "Название фильма",
			"season": "Сезон",
			"episode": "Эпизод",
			"translation": "Перевод",
			"resolution": "Качество"
		},
		'uk': {
			"settings": "Налаштування",
			"saveButton": "Зберегти",
			"resetButton": "Скинути",
			"closeButton": "Закрити",
			"downloadStr": "Завантажити",
			"downloadLinkDesc": "Натисніть на посилання, утримуючи клавішу Alt, щоб зберегти файл",
			"cancelDownload": "Скасувати",
			"fileNamePattern": "Шаблон імені файлу",
			"insertVariable": "Вставити змінну",
			"help": "Допомога",
			"movieTitle": "Назва фільму",
			"season": "Сезон",
			"episode": "Епізод",
			"translation": "Переклад",
			"resolution": "Якість"
		}
	}

	const userLang = (navigator.language || navigator.userLanguage).slice(0, 2).toLowerCase();

	// GM_getResourceText
	function getResourceText(name, language = 'en') {
		if (Object.keys(resourceTexts).includes(userLang)) {
			const locale = resourceTexts[userLang]
			if (Object.keys(locale).includes(name)) {
				return locale[name]
			}
		}
		return resourceTexts[language][name]
	}

	GM_registerMenuCommand(getResourceText('settings'), () => {

		const fragment = document.createElement('div')
		fragment.innerHTML =
		`<div id="HDRezkaDownloaderSettingsPage" style="position: fixed; z-index: 10000; top: 0; right: -50%; will-change: right; transition: 0.5s;
					border-radius: 0 0 0 12px; background: white; filter: drop-shadow(0px 0px 2px black); font-size: 14pt; min-width: 300px;">
			<div style="text-align: right; cursor: pointer; margin: 10px;">
				<img name="close" style="height: 20px;" title="${getResourceText('closeButton')}" src="${GM_getResourceURL('closeButtonIcon')}"></img>
			</div>
			<div style="text-align: center; padding: 20px; padding-top: 0;">
				<h3 style="font-size: 1.17em;">${getResourceText('settings')}</h3>

				<hr style="border-top: 1px solid #dfe1e8; margin: 0.5em 0;">

				<div style="text-align:left;">

					<span id="filename_structure_block" style="display: block; margin: 8px 0 10px 30px;">
						<span>${getResourceText("fileNamePattern")}:</span>
						<div style="position: relative;">
							<input type="text" id="filename_structure" style="display: block; width: 100%;
									font-size: 16px; margin: 5px 0; font-family: monospace;">
							<div id="variables_list" style="position: absolute; display: none; flex-direction: column;
									background: lightblue; color: black; padding: 3px; border-radius: 15px;
									font-size: 0.9em; font-family: monospace;">
								<span style="padding: 3px 12px; cursor: pointer; border-radius: 12px;"
									value="%title">${getResourceText("movieTitle")}</span>
								<span style="padding: 3px 12px; cursor: pointer; border-radius: 12px;"
									value="%season">${getResourceText("season")}</span>
								<span style="padding: 3px 12px; cursor: pointer; border-radius: 12px;"
									value="%episode">${getResourceText("episode")}</span>
								<span style="padding: 3px 12px; cursor: pointer; border-radius: 12px;"
									value="%translation">${getResourceText("translation")}</span>
								<span style="padding: 3px 12px; cursor: pointer; border-radius: 12px;"
									value="%resolution">${getResourceText("resolution")}</span>
							</div>
						</div>
						<button id="insert_variable_but">${getResourceText("insertVariable")}</button>
						<details style="color:grey;font-size: 0.8em;">
							<summary style="padding: 10px 0;cursor:pointer;">${getResourceText("help")}</summary>
							<table>
								<tr>
									<td><code>%title</code></td>
									<td style="text-align:center">${getResourceText("movieTitle")}</td>
								</tr>
								<tr>
									<td><code>%season</code></td>
									<td style="text-align:center">${getResourceText("season")}</td>
								</tr>
								<tr>
									<td><code>%episode</code></td>
									<td style="text-align:center">${getResourceText("episode")}</td>
								</tr>
								<tr>
									<td><code>%translation</code></td>
									<td style="text-align:center">${getResourceText("translation")}</td>
								</tr>
								<tr>
									<td><code>%resolution</code></td>
									<td style="text-align:center">${getResourceText("resolution")}</td>
								</tr>
							</table>
						</details>
					</span>
				</div>
				
				<hr style="border-top: 1px solid #dfe1e8; margin: 0.5em 0;">
				<button name="save" style="font-size: 14pt; cursor: pointer; border: 5em; outline: none;
											margin-top: 5px; padding: 0.5em 1.5em; border-radius: 65px;
											background-image: linear-gradient(45deg, #4568dc, #b06ab3);
											box-shadow: 1px 1px 10px grey; color: white;">
					<img src="${GM_getResourceURL('saveButtonIcon')}"></img>
					<span>${getResourceText("saveButton")}</span>
				</button>
				<p style="display: flex; align-items: center; justify-content: space-between; margin-top: 1em">
					<a style="display: flex; align-items: center;" href="https://github.com/dkazankov/HDrezka-Downloader" target="_blank">
					<svg style="background: white; border-radius: 50px; padding: 1px;" xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
					<span style="margin-left:5px; color: blue;">GitHub</span>
					</a>

					<img style="margin-top:2px;" src="https://shields.io/badge/version-v1.0.0.1-blue">
				</p>
			</div>
		</div>`

		const page = fragment.firstElementChild

		const keys = GM_listValues()
		for (const key of keys) {
			if (key === 'filename_structure') continue

			const val = GM_getValue(key)
			const els = page.querySelectorAll(`input[name=${key}]`)
			try {
				if (els.length > 1) {
					const el = Array.from(els).filter(e => e.value == val)[0]
					el.checked = true
				}
				else {
					els[0].checked = val
				}
			} catch {
				GM_deleteValue(key)
			}
		}
		if (keys.filename_structure) {
			dinamic_input(keys.filename_structure)
		} else {
			dinamic_input('%title-s%seasone%episode-%translation-%resolution')
		}

		const img = page.querySelector('img[name=close]')
		img.onclick = () => {
			page.style.right = '-50%'
			page.remove()
		}
		const save = page.querySelector('button[name=save]')
		save.onclick = () => saveSettings()

		document.body.appendChild(page)

		window.addEventListener('keydown', function (e) {
			if (e.code == 17) { // CTRL
				if (!e.repeat) {
					save.innerHTML =
						`<img src="${GM_getResourceURL('resetButtonIcon')}"></img>
						<span>${getResourceText("resetButton")}</span>`
					save.onclick = () => {
						GM_listValues().forEach(key => GM_deleteValue(key))
						window.location.reload()
					}
				}
			}
		})
		window.addEventListener('keyup', function (e) {
			if (e.code == 17) { // CTRL
				save.innerHTML =
					`<img src="${GM_getResourceURL('saveButtonIcon')}"></img>
					<span>${getResourceText("saveButton")}</span>`
				save.onclick = () => saveSettings()
			}
		})

		page.style.right = 0

		function saveSettings() {
			let settings = {}
			let inputs = page.querySelectorAll('input.settings')
			Array.from(inputs).forEach(e => {
				if (e.type == 'checkbox') {
					settings[e.name] = e.checked
				}
				else if (e.type == 'radio' && e.checked) {
					settings[e.name] = e.value
				}
			})
			settings.filename_structure = page.querySelector('#filename_structure').value
			for (const key in settings) {
				GM_setValue(key, settings[key])
			}
			window.location.reload()
		}
		function dinamic_input(init_value) {
			const input = page.querySelector('#filename_structure')
			input.value = init_value
			page.querySelectorAll('#variables_list > *').forEach(e => {
				e.onmouseover = () => {
					e.style.background = '#00C0FF'
				}
				e.onmouseout = () => {
					e.style.background = ''
				}
				e.onclick = () => {
					if (input.value != '') {
						input.value += ' '
					}
					input.value += e.getAttribute('value')
					page.querySelector('#variables_list').style.display = 'none'
					input.focus()
				}
			})
			function hideInsertMenu() {
				page.querySelector('#variables_list').style.display = 'none'
				page.removeEventListener('click', hideInsertMenu)
			}
			page.querySelector('#insert_variable_but').onclick = () => {
				page.querySelector('#variables_list').style.display = 'flex'
				page.addEventListener('click', hideInsertMenu)
			}
			input.addEventListener('focus', () => {
				input.selectionStart = input.selectionEnd = input.value.length
			})
		}
	})

	const trashList = ['@', '#', '!', '^', '$']
	const trashCodesSet = product(trashList, 2).concat(product(trashList, 3)).map(e => e.join(''))

	const player = document.getElementById('player')
	if (player) {
		//document.title = document.querySelector('.b-content__main .b-post__title').innerText
		const sendVideoIssue = document.getElementById('send-video-issue')

		const downloadMenu = createDownloadMenu()
		sendVideoIssue.parentNode.appendChild(downloadMenu)

		const downloadButton = createDownloadButton()
		sendVideoIssue.parentNode.insertBefore(downloadButton, sendVideoIssue);

		resetDownloadMenu()

		let prev = player.getElementsByTagName('video')[0].src
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				const player = document.getElementById('player')
				const src = player.getElementsByTagName('video')[0].src
				if (prev !== src) {
					prev = src
					resetDownloadMenu()
				}
			})
		})
		observer.observe(document.querySelector('body'), { childList: true, subtree: true })
	}

	function createDownloadButton() {
		const fragment = document.createElement('div')
		fragment.innerHTML =
		`<div id="HDRezkaDownloaderDownloadButton" title="${getResourceText('downloadStr')}" style="right: 55px; top: 0; height: 50px; width: 50px;
			position: absolute; cursor: pointer; transition: 0.3s; background: #32cd32; color=white;">
			<img style="height: 40px; width: 40px; padding: 5px; color: white;" src="${GM_getResourceURL('downloadButtonIcon')}"></img>
		</div>`

		const button = fragment.firstElementChild
		button.onmouseover = () => {
			button.style.background = '#013220'
		}
		button.onmouseout = () => {
			button.style.background = '#32cd32'
		}
		button.onclick = () => {
			const downloadMenu = document.querySelector('#HDRezkaDownloaderDownloadMenu')
			if (downloadMenu.style.display === 'none') {
				downloadMenu.style.transform = 'scale(1)'
				downloadMenu.style.opacity = 1
				downloadMenu.style.display = 'block'
				document.body.addEventListener('click', bodyOnClick)
			} else {
				downloadMenu.style.transform = 'scale(0)'
				downloadMenu.style.opacity = 0
				downloadMenu.style.display = 'none'
				document.body.removeEventListener('click', bodyOnClick)
			}
		}
		return button
	}
	function bodyOnClick(event) {
		const downloadMenu = document.querySelector('#HDRezkaDownloaderDownloadMenu')
		const downloadButton = document.querySelector('#HDRezkaDownloaderDownloadButton')

		const path = event.path || (event.composedPath && event.composedPath());
		if (!path.includes(downloadMenu) && !path.includes(downloadButton)) {
			document.body.removeEventListener('click', bodyOnClick)
			downloadMenu.style.transform = 'scale(0)'
			downloadMenu.style.opacity = 0
			downloadMenu.style.display = 'none'
		}
	}

	function createDownloadMenu() {
		const fragment = document.createElement('div')
		fragment.innerHTML =
		`<div id="HDRezkaDownloaderDownloadMenu" style="display: none; min-height: 50px; width: 160px; background: rgba(93, 93, 93, 0.5); backdrop-filter: blur(5px);
				position: absolute; border-radius: 6px; padding: 4px; filter: drop-shadow(black 2px 4px 6px); z-index: 100; right: 0; top: 55px; opacity: 0;
				transform: scale(0); transform-origin: top center; transition: 0.5s;">
			<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" height="50px" style="margin:auto;display:block;" >
			<g transform="translate(25 50)">
				<circle cx="0" cy="0" r="6" fill="lightblue"><animateTransform attributeName="transform" type="scale" begin="-0.3333333333333333s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite"></animateTransform></circle>
			</g>
			<g transform="translate(50 50)">
				<circle cx="0" cy="0" r="6" fill="lightblue"><animateTransform attributeName="transform" type="scale" begin="-0.16666666666666666s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite"></animateTransform></circle>
			</g>
			<g transform="translate(75 50)">
				<circle cx="0" cy="0" r="6" fill="lightblue"><animateTransform attributeName="transform" type="scale" begin="0s" calcMode="spline" keySplines="0.3 0 0.7 1;0.3 0 0.7 1" values="0;1;0" keyTimes="0;0.5;1" dur="1s" repeatCount="indefinite"></animateTransform></circle>
			</g>
			</svg>
		</div>`
		const menu = fragment.firstElementChild
		return menu
	}

	async function resetDownloadMenu() {
		const downloadMenu = document.querySelector('#HDRezkaDownloaderDownloadMenu')
		downloadMenu.innerHTML = ''

		if (CDNPlayerInfo.streams) {
			let decoded = false
			let streams
			try {
				streams = clearTrash(CDNPlayerInfo.streams).split(',')
				decoded = true
			} catch (error) {
				console.log('Cannot decode streams url', CDNPlayerInfo.streams)
			}

			const list = document.createElement("div")
			if ( decoded ) {
				let season, episode;
				let element = document.querySelector('#simple-episodes-tabs .active')
				if (element) {
					season = element.getAttribute('data-season_id')
					episode = element.getAttribute('data-episode_id')
				}
				let translation;
				element = document.querySelector('#translators-list .active')
				if (element) {
					translation = element.innerText.trim()
				}
				//const name = document.querySelector('.b-content__main .b-post__title').innerText
				const name = document.querySelector('.b-content__main .b-post__origtitle').innerText

				for (const stream of streams) {
					const temp = stream.split('[')[1].split(']')
					const quality = temp[0]
					const links = temp[1].split(' or ')
					const link = links[1]
					const fileName = buildFileName(name, season, episode, translation, quality)

					let size = 0
					try {
						size = await getFileSize(link)
					} catch (error) {
						console.error({ '_': error, 'name': quality, 'url': link })
					}
					const a = makeDownloadLink(link, fileName+'.mp4', 'video/mp4', quality, formatBytes(size, 1))
					list.appendChild(a);
				}

			} else {
				const a = makeDownloadLink(CDNPlayerInfo.streams, '', '', 'Incorrect streams', '')
				list.appendChild(a);
			}
			downloadMenu.appendChild(list)
		}

		if (CDNPlayerInfo.subtitle) {
			const subtitles = CDNPlayerInfo.subtitle.split(',')

			const fragment = document.createElement('div')
			fragment.innerHTML =
			`<details style="border: 1px solid white; border-radius: 8px; margin: 2px; margin-top: 8px; cursor: pointer">
				<summary style="color: aqua; border-radius: 8px; text-align: center; transition: 0.2s;">
					${getResourceText("subtitles")}
				</summary>
			</details>`
	
			const details = fragment.firstElementChild
			const summary = details.firstElementChild
			summary.onmouseover = () => {
				summary.style.background = 'blueviolet'
			}
			summary.onmouseout = () => {
				summary.style.background = null
			}

			for (const subtitle of subtitles) {
				const temp = subtitle.split('[')[1].split(']')
				const lang = temp[0]
				const link = temp[1]
				let size = 0;
				try {
					size = await getFileSize(link)
				} catch (error) {
					console.error({ '_': error, 'name': lang, 'url': link })
				}

				const a = makeDownloadLink(link, '', 'application/octet-stream', lang, formatBytes(size, 1))
				details.appendChild(a)
			}

			downloadMenu.appendChild(details)
		}

		function buildFileName(title, season, episode, translation, resolution) {
			let temp = GM_getValue("filename_structure")
			if (temp) {
				for (const [key, value] of Object.entries({
					title,
					season,
					episode,
					translation,
					resolution
				})) {
					temp = temp.replaceAll('%'+key, value)
				}
				temp = temp.replaceAll(':', '')
				temp = temp.replaceAll('/', '')
				temp = temp.replaceAll(' ', '_')
				return temp
			} else {
				return ''
			}
		}
		function makeDownloadLink(href, fileName, type, title, size) {
			const fragment = document.createElement('div')
			fragment.innerHTML =
			`<a href="${href}" target="_blank" download="${fileName}" title="${getResourceText('downloadLinkDesc')}" type="${type}" style="display: block;
					color: white; text-decoration: none; padding: 4px 5px; margin: 2px 0; border-radius: 6px; transition: 0.2s; cursor: pointer;">
				<span>${title}</span>
				<span style="float: right;">${size}</span>
			</a>`
	
			const a = fragment.firstElementChild
			a.onmouseover = () => {
				a.style.background = 'rgb(0, 0, 255, 0.75)'
			}
			a.onmouseout = () => {
				a.style.background = null
			}
			a.onclick = (event) => {
				event.preventDefault()
				if (a.classList.contains('blocked')) {
					return
				}
				a.classList.add('blocked')

				// Downloader 2.1
				const fragment = document.createElement('div')
				fragment.innerHTML =
				`<span class="download-area" style="display: flex; align-items: center; padding: 6px 0;">
					<progress max="100">
					</progress>
					<span style="margin-left: 5px;">0%</span>
					<button style="margin-left: 5px; border-radius: 50px; border: 2px solid transparent; height: 20px; width: 20px; display: flex;
						align-items: center; justify-content: center; color: red; transition: 0.25s;" title="${getResourceText('cancelDownload')}">X</button>
				</span>`

				const area = fragment.firstElementChild
				const progress = area.firstElementChild
				const percentage = progress.nextElementSibling
				const closeButton = area.lastElementChild

				const controller = new AbortController()

				closeButton.onclick = () => {
					controller.abort()
					onAbort()
				}
				closeButton.onmouseover = () => {
					closeButton.style.borderColor = "red"
				}
				closeButton.onmouseout = () => {
					closeButton.style.borderColor = "transparent"
				}

				a.appendChild(area)

				startDownload()

				function onAbort() {
					setTimeout(() => {
						area.remove()
						//a.style.background = null
						a.classList.remove('blocked')
					}, 1000)
				}
				function onSuccess() {
					setProgress(100)
					setTimeout(() => {
						area.remove()
						//a.style.background = null
						a.classList.remove('blocked')
					}, 1000)
				}
				function setProgress(percent) {
					progress.value = percent;
					percentage.innerText = percent + "%"
				}

				async function startDownload() {
					try {
						const handle = await window.showSaveFilePicker.call(window.Target, { suggestedName: a.download }) // window is Proxy
						const response = await fetch(a.href, { signal: controller.signal })
						if (!response.ok) {
							throw new Error(response.statusText, { cause: response.status })
						}
						const length = +response.headers.get('content-length')
						let countBytes = 0
						let countChunks = 0
						try {
							const writable = await handle.createWritable()
							await response.body
								.pipeThrough(new TransformStream({
									transform(chunk, controller) {
										controller.enqueue(chunk)
										countChunks++
										countBytes += chunk.byteLength

										const percent = ( length === 0? countChunks: Math.round(100 * countBytes / length) )
										setProgress( Math.min(percent, 100) )
									}
								}), { signal: controller.signal })
								.pipeTo(writable, { signal: controller.signal })
							onSuccess()
						} catch (error) {
							if (error.name !== 'AbortError') {
								console.error(error.name, error.message)
							}
							// const file = await handle.getFile()
							// file.remove()
							onAbort()
						}
					} catch (error) {
						if (error.name !== 'AbortError') {
							console.error(error.name, error.message)
						}
						onAbort()
					}
				}
			}
			return a
		}
	}

	function product(iterables, repeat) {
		return Array.from({length: repeat}, () => [...iterables]).reduce((a, v) => a.flatMap(d => v.map(e => [d, e].flat())))
	}
	function clearTrash(data) {
		let trashString = data.replace('#h', '').split('//_//').join('')
		for (const element of trashCodesSet) {
			trashString = trashString.replaceAll(btoa(element), '')
		}
		return atob(trashString)
	}
	async function getFileSize(url) {
		const response = await fetch(url, { method: 'HEAD' })
		const fileSize = response.headers.get('content-length')
		return +fileSize
	}
	function formatBytes(bytes, decimals = 2) {
		if (bytes === NaN) return 'Unknown'
		if (bytes === 0) return '0 Bytes'
		const k = 1024
		const dm = decimals < 0 ? 0 : decimals
		const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
		const i = Math.floor(Math.log(bytes) / Math.log(k))
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
	}
})()
