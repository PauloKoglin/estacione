package br.furb.security;

import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@EnableWebSecurity
@Configuration
public class ServerSecurityConfig extends WebSecurityConfigurerAdapter {

	@Autowired
	private EstacioneDetailService estacioneDetailService;

	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		Random random = new Random();
		long adminPassoword = random.nextLong();
		auth.userDetailsService(estacioneDetailService).and().jdbcAuthentication();
		System.out.println("Admin password: " + adminPassoword);
	}

	@Override
	@Bean
	public AuthenticationManager authenticationManagerBean() throws Exception {
		return super.authenticationManagerBean();
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		// SecurityFilter filter = new SecurityFilter();
		// http.addFilterBefore(filter, BasicAuthenticationFilter.class);
		http.authorizeRequests().antMatchers("/estacionamento", "/historico", "/usuario").hasAnyAuthority("USER");
	}
}