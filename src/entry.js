import './style.scss';
import Model from './MVC/model';
import Controller from './MVC/controller';

Model.login(6771756)
  .then(Controller.init());