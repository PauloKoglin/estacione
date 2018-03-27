package br.furb.persistence;

import org.hibernate.Criteria;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import br.furb.endpoints.usuario.UsuarioPojo;
import br.furb.model.NecessidadeEntity;
import br.furb.model.UsuarioEntity;

@Repository
public class UsuarioDao extends BaseDao<UsuarioEntity, UsuarioPojo> {

	/*private static final SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault());*/
	
	@Override
	public Class<UsuarioEntity> getEntityClass() {
		return UsuarioEntity.class;
	}

	@Override
	protected UsuarioEntity pojoToEntity(UsuarioPojo pojo, UsuarioEntity entity) {
		entity.setNome(pojo.getNome());
		entity.setEmail(pojo.getEmail());
		
		/*Criteria criteria = hibernateTemplate.getSessionFactory().getCurrentSession()
				.createCriteria(UsuarioEntity.class);
		criteria.add(Restrictions.or(Restrictions.eq("login", SecurityContextHolder.getContext().getAuthentication().getName())));
		Object uniqueResult = criteria.uniqueResult();
		if (uniqueResult != null) {
			entity.setUsuario((UsuarioEntity)uniqueResult);
		}
		return entity;*/
		return entity;
	}

	@Override
	protected UsuarioPojo entityToPojo(UsuarioEntity entity, UsuarioPojo pojo) {
		pojo.setEmail(entity.getEmail());
		pojo.setNome(entity.getNome());
		
		return pojo;
	}

	@Override
	protected UsuarioEntity newEntity(Object...adicionais) {
		return new UsuarioEntity();
	}

	@Override
	protected UsuarioPojo newPojo(Object...adicionais) {
		return new UsuarioPojo();
	}
	
	@Transactional(readOnly = true)
	public Long getIdByLogin(String usuarioLogin){
		Criteria UsuarioByLogin = hibernateTemplate
				.getSessionFactory().getCurrentSession().createCriteria(UsuarioEntity.class);
		UsuarioByLogin.createAlias("usuario", "usu");
		UsuarioByLogin.add(Restrictions.eq("usu.ds_login", usuarioLogin));
		//UsuarioByLogin.setProjection(Projections.max("codigo"));
		Object uniqueResult = UsuarioByLogin.uniqueResult();
		if (uniqueResult != null) {
			return (Long)uniqueResult+1L;
		}else{
			return 1L;
		}
	}

}
