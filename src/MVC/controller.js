import Model from './model';
import View from './view';

export default {
  app: document.getElementById('app'),
  async init() {
    class List {
      constructor(name) {
        this.node = document.querySelector(`${name} .friends__list`);
        this.parent = this.node.parentElement;
        this.input = document.querySelector(`${name} .friends__input`);
        this.isDisplaySelected = name.includes('selected');
      }
      filtration(data) {
        const isMatching = (full, chunk) => full.toLowerCase().includes(chunk.toLowerCase());

        data.filter(this.isDisplaySelected).forEach(el => {
          const fullName = `${el.first_name} ${el.last_name}`;

          isMatching(fullName, this.input.value) ?
            el.node.classList.remove('friends__item--hidden') :
            el.node.classList.add('friends__item--hidden');
        });
      }
    }
    const displayList = new List('.friends__display');
    const displaySelectedList = new List('.friends__display-selected');
    let friends = {
      map: {},
      array: [],
      filter(bySelected) {
        return this.array.filter(friend => bySelected ? friend.selected : !friend.selected);
      }
    };

    if (localStorage.save) {
      friends = { ...friends, ...JSON.parse(localStorage.friends) };
      displayList.node.innerHTML = View.render('friend-template', friends.filter(false));
      displaySelectedList.node.innerHTML = View.render('friend-template', friends.filter(true));
    } else {
      friends.array = await Model.getFriends({ fields: 'photo_100'});
      for (const friend of friends.array) {
        friend.selected = false;
      }
      displayList.node.innerHTML = View.render('friend-template', friends.array);
    }

    for (const friend of friends.array) {
      friend.node = document.querySelector(`.friends__item[data-id="${friend.id}"]`);
      friends.map[friend.id] = friend;
    }

    const render = (data, id) => {
      const btn = document.querySelector(`.friends__item[data-id="${id}"] .friends__btn`);
      const list = data[id].selected ? displayList : displaySelectedList;

      list.node.appendChild(data[id].node);
      data[id].selected = !data[id].selected;
      list.filtration(friends);
      btn.classList.toggle('friends__btn--close');
    };

    this.app.addEventListener('click', e => {
      if (e.target.classList.contains('friends__btn')) {
        const id = e.target.parentElement.dataset.id;

        render(friends.map, id);
      }
    });

    const bindMap = {
      'displayList': displayList,
      'displaySelectedList': displaySelectedList
    };

    this.app.addEventListener('input', e => {
      bindMap[e.target.dataset.bind].filtration(friends);
    });

    const makeDnD = (zones, data) => {
      let currentDrag;

      zones.forEach(zone => {
        zone.addEventListener('dragstart', e => {
          currentDrag = {source: zone, node: e.target, id: e.target.dataset.id};
        });

        zone.addEventListener('dragover', e => {
          e.preventDefault();
        });

        zone.addEventListener('drop', e => {
          if (currentDrag) {
            e.preventDefault();

            if (currentDrag.source !== zone) {
              render(data, currentDrag.id);
            }
          }
        });
      })
    };
    makeDnD([displayList.parent, displaySelectedList.parent], friends.map);
    const btnSave = document.querySelector('.footer__btn-save');

    btnSave.addEventListener('click', () => {
      localStorage.friends = JSON.stringify(friends);
      localStorage.save = 'true';
      alert('Состояние сохранено');
    });
  }
};