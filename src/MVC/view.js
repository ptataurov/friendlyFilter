import Handelbars from 'handlebars/dist/handlebars.min';

export default {
  render(templateName, data) {
    const template = document.getElementById(templateName);
    const render = Handelbars.compile(template.innerHTML);

    return render(data);
  }
};
