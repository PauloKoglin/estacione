/**
 * 
 */
package br.furb.model;

/**
 * @author PauloArnoldo
 *
 */
public class Pessoa {
	private String nome;
	private String email;
	private String senha;
	private boolean termosPoliticas;
	public String getNome() {
		return nome;
	}
	public void setNome(String nome) {
		this.nome = nome;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getSenha() {
		return senha;
	}
	public void setSenha(String senha) {
		this.senha = senha;
	}
	public boolean isTermosPoliticas() {
		return termosPoliticas;
	}
	public void setTermosPoliticas(boolean termosPoliticas) {
		this.termosPoliticas = termosPoliticas;
	}
	
	
	
}
