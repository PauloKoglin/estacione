/**
 * 
 */
package br.furb.endpoints.usuario;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import br.furb.endpoints.usuario.UsuarioPojo;
import br.furb.persistence.UsuarioDao;

/**
 * @author PauloArnoldo
 *
 */


@RestController
@RequestMapping("usuario")
public class UsuarioController {

	@Autowired @Lazy private UsuarioDao usuarioDao;


	@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE, method = RequestMethod.GET, value = "/{idUsuario}")
	public ResponseEntity<UsuarioPojo> getusuario(@PathVariable("idUsuario") Long idUsuario) {
		return new ResponseEntity<>(usuarioDao.find(idUsuario), HttpStatus.OK);
	}

	@RequestMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE,
			method = RequestMethod.POST, value = {"/{idUsuario}"})
	public ResponseEntity<UsuarioPojo> saveusuario(@RequestBody UsuarioPojo usuario, @PathVariable("idUsuario") Long idUsuario) {
		return new ResponseEntity<>(usuarioDao.save(usuario, idUsuario), HttpStatus.OK);
	}
	
	@RequestMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE,
			method = RequestMethod.POST)
	public ResponseEntity<UsuarioPojo> cadastrausuario(@RequestBody UsuarioPojo usuario) {
		return new ResponseEntity<>(usuarioDao.save(usuario, null), HttpStatus.OK);
	}
}
